import { ApiError, BusinessError, NetworkError, ResponseValidationError, TimeoutError } from "../error-handling";
import { API_CONFIG } from "./api-config";

// Request options
export interface ApiRequestOptions {
  headers?: HeadersInit;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
  rawResponse?: boolean;
  accessToken?: string;
}

// Pageable
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Array<{
    direction: 'ASC' | 'DESC';
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    descending: boolean;
    ascending: boolean;
  }>
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Pagination Data
export interface PaginationData<T> {
  content: T;
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: Array<{
    direction: 'ASC' | 'DESC';
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    descending: boolean;
    ascending: boolean;
  }>;
  first: boolean;
  empty: boolean;
}

// Api Response From Server
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
  timestamp?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any; // For additional filters
}

class ApiClient {
  private cache = new Map<string, { data: any, timestamp: number, ttl: number }>();
  private requestCount = 0;
  private getAuthStore?: () => { accessToken: string | null; refreshAccessToken: () => Promise<void> };

  constructor(private baseUrl: object = API_CONFIG.API_END_POINT) { }

  setAuthStore(getAuthStore: () => { accessToken: string | null; refreshAccessToken: () => Promise<void> }): void {
    this.getAuthStore = getAuthStore;
  };

  /**
   * Get access token
   */
  private getAccessToken(optionsToken?: string): string | null {
    if (optionsToken) return optionsToken;
    if (this.getAuthStore) {
      return this.getAuthStore().accessToken;
    }
    return null;
  }

  /**
   * Generate unique cache key
   * @param url
   * @param options
   * @returns string
   */
  private generateCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || "GET";
    const body = options?.body ? JSON.stringify(options.body) : "";
    return `${method}:${url}:${body}`;
  }

  /**
   * Get cache key  
   * @param key
   * @returns T | null
   */
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null;
    }

    return cached.data as T;
  }

  /**
   * Set cache data
   * @param key 
   * @param data 
   * @param ttl 
   */
  private setCachedData<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })

    // Cleanup old cache entries (keep only last 100)
    if (this.cache.size > 100) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      entries.slice(0, this.cache.size - 100).forEach(([key]) => {
        this.cache.delete(key);
      })
    }
  }

  /**
   * Prepare headers with authentication
   */
  private prepareHeaders(options?: ApiRequestOptions): HeadersInit {
    const headers: HeadersInit = {
      ...options?.headers
    };
    const token = this.getAccessToken(options?.accessToken);
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Validate Reponse data
   * @param responseData 
   * @param rawResponse 
   * @returns T
   */
  private processResponse<T>(responseData: any, rawResponse: boolean = false): T {
    if (rawResponse) {
      return responseData as T;
    }
    // If Error
    if (this.isApiResponse(responseData)) {
      const apiResponse = responseData as ApiResponse<T>;
      if (!apiResponse.success) {
        if (apiResponse.errors && apiResponse.errors.length > 0) {
          throw new ResponseValidationError(apiResponse.message, apiResponse.errors);
        } else {
          throw new BusinessError(apiResponse.message);
        }
      }
      // Return if success
      return apiResponse.data;
    }
    // If not ApiReponse structure, return raw data
    return responseData as T;
  }

  /**
   * Check if valid response structure
   * @param data
   * @returns boolean
   */
  private isApiResponse(data: any): data is ApiResponse {
    return (
      data != null
      && typeof data === 'object'
      && typeof data.success === 'boolean'
      && typeof data.message === 'string'
      && 'data' in data
    );
  }

  /**
   * Make request with timeout
   * @param url 
   * @param options 
   * @param timeout 
   * @param rawResponse 
   * @returns 
   */
  private async makeRequestWithTimeout<T>(
    url: string,
    options: RequestInit,
    timeout: number,
    rawResponse: boolean = false
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg: string = `HTTP ${response.status}: ${response.statusText}`
        let errors: string[] = [];

        try {
          const errorData = await response.json();
          if (this.isApiResponse(errorData)) {
            errorMsg = errorData.message || errorMsg;
            errors = errorData.errors || [];
          } else {
            errorMsg = errorData.message || errorData.error || errorMsg;
          }
        } catch {

        }

        if (response.status >= 400 && response.status < 500) {
          if (response.status === 422) {
            throw new BusinessError(errorMsg);
          } else if (response.status === 400) {
            throw new ResponseValidationError(errorMsg, errors);
          } else if (response.status === 401) {
            if (this.getAuthStore) {
              try {
                await this.getAuthStore().refreshAccessToken();
                throw new ApiError("Token refreshed - retry request", response.status, response.statusText, null, errors);
              } catch (refreshError) {
                throw new ApiError("Unauthorized - Invalid or expired token", response.status, response.statusText, null, errors);
              }
            } else {
              throw new ApiError("Unauthorized - Invalid or expired token", response.status, response.statusText, null, errors);
            }
          } else {
            throw new ApiError(errorMsg, response.status, response.statusText, null, errors);
          }
        } else {
          throw new ApiError(errorMsg, response.status, response.statusText);
        }
      }

      const responseData = await response.json();
      this.requestCount++;
      return this.processResponse(responseData, rawResponse);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError(`Request time out after ${timeout}ms`);
        }
        if (error.message.includes('fetch')) {
          throw new NetworkError("Network connection failed");
        }
      }
      throw error;
    }
  }

  /**
   * Make request
   * @param endpoint 
   * @param options 
   * @returns 
   */
  async request<T>(endpoint: string, options: Omit<RequestInit, "cache"> & ApiRequestOptions = {}): Promise<T> {
    const {
      timeout = API_CONFIG.TIMEOUTS.DEFAULT,
      retries = API_CONFIG.RETRY.MAX_ATTEMPTS,
      cache = false,
      cacheTTL = API_CONFIG.CACHE_TTL.PLACES,
      rawResponse = false,
      accessToken,
      ...fetchOptions
    } = options

    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
    const headers = this.prepareHeaders(options);
    const requestOptions = {
      ...fetchOptions,
      headers
    }

    const cacheKey = this.generateCacheKey(url, requestOptions);

    // Check cache first
    if (cache && fetchOptions.method !== "POST") {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    let lastError: Error;
    let delay = API_CONFIG.RETRY.INITIAL_DELAY;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const data = await this.makeRequestWithTimeout<T>(url, requestOptions, timeout);

        // Cache successful responses
        if (cache && fetchOptions.method !== "POST") {
          this.setCachedData(cacheKey, data, cacheTTL);
        }

        return data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (error instanceof ResponseValidationError || error instanceof BusinessError) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries - 1) {
          break;
        }

        // Wait before retry with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, API_CONFIG.RETRY.MAX_DELAY);
      }
    }

    throw lastError!;
  }

  /* ----------------------------------------------------------------------------------- */

  // Http method
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

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

  async post<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      headers: {
        'Content-Type': "application/json",
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /* ----------------------------------------------------------------------------------- */

  // Utility methods
  clearCache(): void {
    this.cache.clear();
  }

  getRequestCount(): number {
    return this.requestCount;
  }

  resetRequestCount(): void {
    this.requestCount = 0;
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  isCached(endpoint: string, options?: RequestInit): boolean {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
    const cacheKey = this.generateCacheKey(url, options);
    return this.cache.has(cacheKey);
  }

  removeCacheEntry(endpoint: string, options?: RequestInit): void {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
    const cacheKey = this.generateCacheKey(url, options);
    this.cache.delete(cacheKey);
  }
}

export const apiClient = new ApiClient();

export { ApiClient };