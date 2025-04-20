import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) throw error;
        const errRes = {
          error: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
        };
        throw new InternalServerErrorException(errRes);
      }),
    );
  }
}
