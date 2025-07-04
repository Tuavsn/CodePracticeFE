const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const API_PREFIX_V1 = process.env.NEXT_PUBLIC_API_PREFIX || 'api/v1'

export const API_CONFIG = {
  // Base Urls
  API_END_POINT: {
    AUTH: `${API_URL}/${API_PREFIX_V1}/auth`,
    USER: `${API_URL}/${API_PREFIX_V1}/users`,
    POST: `${API_URL}/${API_PREFIX_V1}/posts`,
    PROBLEM: `${API_URL}/${API_PREFIX_V1}/problems`,
    NOTIFICATION: `${API_URL}/${API_PREFIX_V1}/notifications`,
  },
  // Rate Limiting
  RATE_LIMITS: {
    GEOCODING: 50, // requests per minute
  },
  // Cache TTL (in miliseconds)
  CACHE_TTL: {
    PLACES: 30 * 60 * 1000, // 30 minutes
    DIRECTIONS: 15 * 60 * 1000, // 15 minutes
    GEOCODING: 60 * 60 * 1000, // 1 hour
    AMENITIES: 20 * 60 * 1000, // 20 minutes
  },
  // Request Timeouts
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    PLACES: 15000, // 15 seconds
    DIRECTIONS: 20000, // 20 seconds
  },
  // Retry Configurations
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000, // 1 second
    MAX_DELAY: 10000, // 10 seconds
  }
}

// Validate required environment variables
export function validateApiConfig(): void {

}