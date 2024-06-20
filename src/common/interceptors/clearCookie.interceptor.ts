import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ClearCookieInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      tap(async (data) => {
        if (data && data.refreshToken) {
          const headers = request.headers;
          if (
            headers.authorization &&
            headers.authorization.startsWith('Bearer ')
          ) {
            // const accessToken = headers.authorization.split(' ')[1];
            try {
              // await this.redisService.setTokenWithExpiry(
              //   accessToken,
              //   accessToken,
              // );
              response.clearCookie('refreshToken');
            } catch (error) {
              console.error('Error storing token in Redis:', error);
            }
          } else {
            console.warn('Authorization header is missing or malformed');
          }
        }
      }),
    );
  }
}
