import { Module } from '@nestjs/common';
import { StockGateway } from './stock.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  providers: [StockGateway],
  imports: [JwtModule, UserModule],
  exports: [StockGateway],
})
export class SocketModule {}
