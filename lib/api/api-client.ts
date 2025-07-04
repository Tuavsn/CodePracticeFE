import { ResponseValidationError } from "../error-handling";
import { API_CONFIG } from "./api-config";

// Request options
export interface ApiRequestOptions {
  headers?: HeadersInit;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
  rawRespone?: boolean;
}

// Api Response From Server
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  }
}

class ApiClient {
  private cache = new Map<string, { data: any, timestamp: number, ttl: number }>();
  private requestCount = 0;

  constructor(private baseUrl: object = API_CONFIG.API_END_POINT) { }

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
   * Validate Reponse data
   * @param responseData 
   * @param rawRespone 
   * @returns T
   */
  private processResponse<T>(responseData: any, rawRespone: boolean = false): T {
    if (rawRespone) {
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
            throw new ValidationError(errorMsg, errors);
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
      rawRespone = false,
      ...fetchOptions
    } = options

    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
    const cacheKey = this.generateCacheKey(url, fetchOptions);

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
        const data = await this.makeRequestWithTimeout<T>(url, fetchOptions, timeout);

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

        if (error instanceof ValidationError || error instanceof BusinessError) {
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
}

export const apiClient = new ApiClient();

export { ApiClient };