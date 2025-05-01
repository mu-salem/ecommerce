import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './modules/category/category.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { BrandModule } from './modules/brand/brand.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('HOST'),
            auth: {
              user: configService.get<string>('EMAIL'),
              pass: configService.get<string>('PASS'),
            },
          },
          from: configService.get<string>('EMAIL'),
        };
      },
    }),
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    BrandModule,
    SubcategoryModule,
    CouponModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
