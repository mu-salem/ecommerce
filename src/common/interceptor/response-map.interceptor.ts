import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class ResponseMapInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      tap((res) => console.log('Response before editing: ', res)),
      map((res) => ({
        success: true,
        time: new Date().toISOString(),
        data: res.data || [],
        message: res.message || '',
      })),
      tap((res) => console.log('Response after editing: ', res)),
    );
  }
}
