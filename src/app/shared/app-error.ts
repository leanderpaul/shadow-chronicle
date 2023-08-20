/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */
import { type GraphQLError } from '@app/shared/services';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

export class AppError extends Error {
  constructor(message = 'Unexpected error') {
    super(message);
    this.name = 'AppError';
  }

  static parseGraphQLError(errors: GraphQLError | GraphQLError[], throwError?: false): AppError;
  static parseGraphQLError(errors: GraphQLError | GraphQLError[], throwError: true): never;
  static parseGraphQLError(errors: GraphQLError | GraphQLError[], throwError?: boolean): AppError {
    const error = Array.isArray(errors) ? errors[0] : errors;
    const appError = new AppError(error?.message);
    if (throwError) throw appError;
    return appError;
  }

  static parseError(error: unknown, throwError?: false): AppError;
  static parseError(error: unknown, throwError: true): never;
  static parseError(error: unknown, throwError?: boolean): AppError {
    if (error instanceof AppError) return error;
    if (error instanceof Error) return new AppError(error.message);
    const appError = new AppError((error as { message?: string })?.message || error?.toString());
    if (throwError) throw appError;
    return appError;
  }
}
