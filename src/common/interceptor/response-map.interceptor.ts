import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable, tap } from 'rxjs';
import { SKIP_INTERCEPTOR } from '../decorators/skip-interceptor.decorator';

@Injectable()
export class ResponseMapInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_INTERCEPTOR, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) return next.handle();

    return next.handle().pipe(
      tap((res) => console.log('Response before editing: ', res)),
      map((res) => ({
        success: true,
        time: new Date().toISOString(),
        data: res?.data || [],
        message: res.message || '',
      })),
      tap((res) => console.log('Response after editing: ', res)),
    );
  }
}
