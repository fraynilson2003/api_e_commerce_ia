import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError | EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof QueryFailedError) {
      // Manejo de QueryFailedError
      const errorMessage = exception.message;
      console.error(errorMessage);

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
        error: 'Internal Server Error',
      });
    } else if (exception instanceof EntityNotFoundError) {
      // Manejo de EntityNotFoundError
      const errorMessage = exception.message;
      console.error(errorMessage);

      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Entity not found',
        error: errorMessage,
      });
    }
  }
}
