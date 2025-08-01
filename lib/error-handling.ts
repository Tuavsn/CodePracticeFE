// Http Status Code
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER: 500,
  NETWORK_ERROR: 0
}

// Internal Error Code
export const ERROR_CODE = {
  RESPONSE_VALIDATION_ERROR: 'RESPONSE_VALIDATION',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  ZOD_VALIDATION_ERROR: 'ZOD_VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  TOKEN_EXPIRED_ERROR: 'TOKEN_EXPIRED_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  PROBLEM_NOT_FOUND: 'PROBLEM_NOT_FOUND',
  SUBMISSION_NOT_FOUND: 'SUBMISSION_NOT_FOUND',
  BUSINESS_ERROR: 'BUSINESS_ERROR'
}

// Base ApiError class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public detail?: any,
    public errors?: string[]
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Api Response validation error
export class ResponseValidationError extends ApiError {
  constructor(
    message: string = 'Response validation failed',
    errors: string[] = []
  ) {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODE.RESPONSE_VALIDATION_ERROR,
      errors
    );
    this.name = this.constructor.name;
  }
}

// Network error
export class NetworkError extends ApiError {
  constructor(
    message: string,
  ) {
    super(
      message,
      HTTP_STATUS.NETWORK_ERROR,
      ERROR_CODE.NETWORK_ERROR
    );
    this.name = this.constructor.name;
  }
}

// Timeout error
export class TimeoutError extends ApiError {
  constructor(
    message: string,
  ) {
    super(
      message,
      HTTP_STATUS.REQUEST_TIMEOUT,
      ERROR_CODE.TIMEOUT_ERROR
    );
    this.name = this.constructor.name;
  }
}

// Authentication error
export class AuthenticationError extends ApiError {
  constructor(
    message: string = 'Authentication failed'
  ) {
    super(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODE.AUTHENTICATION_ERROR
    );
    this.name = this.constructor.name;
  }
}

// Token expired error
export class TokenExpiredError extends ApiError {
  constructor(
    message: string = 'Token has expired'
  ) {
    super(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODE.TOKEN_EXPIRED_ERROR
    );
    this.name = this.constructor.name;
  }
}

// Badrequest error
export class BadRequestError extends ApiError {
  constructor(
    message: string,
    code?: (keyof typeof ERROR_CODE)
  ) {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      code);
    this.name = this.constructor.name;
  }
}

// Notfound error
export class NotFoundError extends ApiError {
  constructor(
    message: string = 'Resouce not found',
    code?: (keyof typeof ERROR_CODE)
  ) {
    super(
      message,
      HTTP_STATUS.NOT_FOUND,
      code
    );
    this.name = this.constructor.name;
  }
}

// Internal server error
export class InternaServerlError extends ApiError {
  constructor(
    message: string = 'Internal server error',
  ) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER,
    );
    this.name = this.constructor.name;
  }
}

export class BusinessError extends ApiError {
  constructor(
    message: string = 'Business error',
  ) {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODE.BUSINESS_ERROR,
    );
    this.name = this.constructor.name;
  }
}

// Forbidden error
export class ForbiddenError extends ApiError {
  constructor(
    message: string = 'Forbidden error',
  ) {
    super(
      message,
      HTTP_STATUS.FORBIDDEN,
    );
    this.name = this.constructor.name;
  }
}

// Exception Factory
export class ExceptionFactory {
  private static readonly exceptionMap = new Map<
    number,
    new (message: string, code?: (keyof typeof ERROR_CODE)) => ApiError
  >([
    [HTTP_STATUS.BAD_REQUEST, BadRequestError],
    [HTTP_STATUS.NOT_FOUND, NotFoundError],
    [HTTP_STATUS.UNAUTHORIZED, AuthenticationError],
    [HTTP_STATUS.REQUEST_TIMEOUT, TimeoutError],
    [HTTP_STATUS.NETWORK_ERROR, NetworkError],
    [HTTP_STATUS.INTERNAL_SERVER, InternaServerlError],
    [HTTP_STATUS.FORBIDDEN, ForbiddenError],
  ])

  /**
   * Return exception class
   * @param statusCode
   */
  public static createException(
    statusCode: number,
    message: string,
    code?: (keyof typeof ERROR_CODE)
  ) {
    const exceptionClass = this.exceptionMap.get(statusCode)
    if (exceptionClass) {
      return new exceptionClass(message, code);
    }
    // Fallback for undefined status
    if (statusCode >= 400 && statusCode < 500) {
      return new BadRequestError(message);
    } else if (statusCode > 500) {
      return new InternaServerlError(message);
    } else {
      return new InternaServerlError('Unknow Error');
    }
  }

  /**
   * Throw new exception
   * @param statusCode 
   */
  public static throwException(
    statusCode: number,
    message: string,
    code?: (keyof typeof ERROR_CODE)
  ): never {
    throw this.createException(statusCode, message, code);
  }
}