import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseMapInterceptor } from './common/interceptor/response-map.interceptor';
import { ErrorHandlerInterceptor } from './common/interceptor/error-handler.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useGlobalInterceptors(
    // new ResponseMapInterceptor(),
    new ErrorHandlerInterceptor(),
  );

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT', 5000);
  await app.listen(port, () => {
    console.log(`Ecommerce listening on port ${port}`);
  });
}
bootstrap();
