import { ApiError, BusinessError, NetworkError, ResponseValidationError, TimeoutError } from "../error-handling";
import { API_CONFIG } from "./api-config";

export interface ApiRequestOptions {
  headers?: HeadersInit;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
  rawResponse?: boolean;
  accessToken?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
  timestamp?: string;
}

export interface PaginationData<T> {
  content: T;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface FilterParams {
  sort?: 'desc' | 'asc';
  tags?: string[];
  search?: string;
}

class ApiClient {
  private cache = new Map<string, { data: any, timestamp: number, ttl: number }>();
  private getAuthStore?: () => { accessToken: string | null; refreshAccessToken: () => Promise<void> };

  constructor(private baseUrl: object = API_CONFIG.API_END_POINT) { }

  setAuthStore(getAuthStore: () => { accessToken: string | null; refreshAccessToken: () => Promise<void> }): void {
    this.getAuthStore = getAuthStore;
  }

  private getAccessToken(optionsToken?: string): string | null {
    return optionsToken || this.getAuthStore?.().accessToken || null;
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || "GET";
    const body = options?.body ? JSON.stringify(options.body) : "";
    return `${method}:${url}:${body}`;
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached || Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  private setCachedData<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });

    // Keep only last 100 entries
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  private processResponse<T>(responseData: any, rawResponse: boolean = false): T {
    if (rawResponse) return responseData as T;

    if (responseData?.success === false) {
      if (responseData.errors?.length > 0) {
        throw new ResponseValidationError(responseData.message, responseData.errors);
      }
      throw new BusinessError(responseData.message);
    }

    return responseData?.data ?? responseData;
  }

  private async makeRequest<T>(url: string, options: RequestInit, timeout: number, rawResponse = false): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
        let errors: string[] = [];

        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
          errors = errorData.errors || [];
        } catch { }

        throw new ApiError(errorMsg, response.status, response.statusText, null, errors);
      }

      const data = await response.json();
      return this.processResponse(data, rawResponse);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError(`Request timed out after ${timeout}ms`);
        }
        if (error.message.includes('fetch')) {
          throw new NetworkError("Network connection failed");
        }
      }
      throw error;
    }
  }

  async request<T>(endpoint: string, options: Omit<RequestInit, "cache"> & ApiRequestOptions = {}): Promise<T> {
    const {
      timeout = API_CONFIG.TIMEOUTS.DEFAULT,
      retries = API_CONFIG.RETRY.MAX_ATTEMPTS,
      cache = false,
      cacheTTL = API_CONFIG.CACHE_TTL.PLACES,
      rawResponse = false,
      accessToken,
      ...fetchOptions
    } = options;

    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
    const token = this.getAccessToken(accessToken);

    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };

    const cacheKey = this.getCacheKey(url, requestOptions);

    // Check cache
    if (cache && fetchOptions.method !== "POST") {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) return cachedData;
    }

    let lastError: Error;
    let delay = API_CONFIG.RETRY.INITIAL_DELAY;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const data = await this.makeRequest<T>(url, requestOptions, timeout, rawResponse);

        // Cache successful responses
        if (cache && fetchOptions.method !== "POST") {
          this.setCachedData(cacheKey, data, cacheTTL);
        }

        return data;
      } catch (error) {
        lastError = error as Error;

        // Handle 401 - refresh token and retry once
        if (error instanceof ApiError && error.status === 401 && attempt === 0 && this.getAuthStore) {
          try {
            await this.getAuthStore().refreshAccessToken();

            // Update token in headers and retry
            const newToken = this.getAuthStore().accessToken;
            if (newToken) {
              requestOptions.headers = {
                ...requestOptions.headers,
                Authorization: `Bearer ${newToken}`
              };
              continue; // Retry with new token
            }
          } catch {
            throw new ApiError("Authentication failed - please login again", 401, "Unauthorized");
          }
        }

        // Don't retry on client errors (except 401 handled above)
        if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (error instanceof ResponseValidationError || error instanceof BusinessError) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries - 1) break;

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, API_CONFIG.RETRY.MAX_DELAY);
      }
    }

    throw lastError!;
  }

  // HTTP methods
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Pagination helper
  async getWithPaginated<T>(endpoint: string, options?: ApiRequestOptions): Promise<PaginationData<T> & {
    hasNext: boolean;
    hasPrevious: boolean;
    getNextPageParams: () => URLSearchParams | null;
    getPreveviousPageParams: () => URLSearchParams | null;
  }> {
    const data = await this.get<PaginationData<T>>(endpoint, options);

    return {
      ...data,
      hasNext: !data.last,
      hasPrevious: !data.first,
      getNextPageParams: () => {
        if (data.last) return null;
        const params = new URLSearchParams();
        params.set('page', (data.number + 1).toString());
        params.set('size', data.size.toString());
        return params;
      },
      getPreveviousPageParams: () => {
        if (data.first) return null;
        const params = new URLSearchParams();
        params.set('page', (data.number - 1).toString());
        params.set('size', data.size.toString());
        return params;
      }
    }
  }


  // Utility methods
  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const apiClient = new ApiClient();
export { ApiClient };