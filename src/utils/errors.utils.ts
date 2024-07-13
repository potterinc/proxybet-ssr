import IUser from "../interfaces/user.interface";

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

/**
 * @description Handles all mongoose validation errors based on the schema provided
 * @throws Custom Error
 */
class MongooseErrorHandler<Type> {
  dataBaseModel: Type;
  /**
   * 
   * @param e Error object
   * @param schema Schema object or interface
   */
  constructor(private e: Error | unknown, schema: Type) {
    this.dataBaseModel = schema;
    this.handleError(this.e)
  }

  /**
   * 
   * @param error Error object
   */
  private handleError(error: Error | unknown | any) {
    switch (error.name) {
      case 'ValidationError':
        for (let path in this.dataBaseModel) {
          if (error.errors[path])
            throw new ValidationError(error.errors[path].message);
        }
        break;
      case 'MongoServerError':
        throw new ServerError('FAILED: User already exist');
      default:
        throw new Error(`Something went wrong: ${error.message}`)
    }
  }
}

export default MongooseErrorHandler;
export { ServerError, NotFoundError, ValidationError }