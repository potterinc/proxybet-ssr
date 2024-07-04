/**
 * @description Custom Error model is not found
 */
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError'
  }
}

/**
 * @description Custom Error for failed server responses
 */
class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError'
  }
}

/**@description Custom error for invalid request */
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError'
  }
}

export {ServerError, NotFoundError, ValidationError}