import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AuthenticationGuard } from './common/gurads/authentication.gurad';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT', 5000);
  await app.listen(port, () => {
    console.log(`Ecommerce listening on port ${port}`);
  });
}
bootstrap();
