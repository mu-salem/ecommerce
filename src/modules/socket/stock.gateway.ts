import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { console } from 'inspector';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { TokenRepository } from 'src/DB/repositories/token.repository';
import { UserRepository } from 'src/DB/repositories/user.repository';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  socketUsers = new Map<string, Socket>();

  constructor(
    private readonly _JWTService: JwtService,
    private readonly _ConfigService: ConfigService,
    private readonly _UserRepository: UserRepository,
    private readonly _TokenRepository: TokenRepository,
  ) {}

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.auth?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new Error('Invalid token');

    const token = authHeader.split(' ')[1];

    try {
      const payload = this._JWTService.verify(token, {
        secret: this._ConfigService.get<string>('JWT_SECRET'),
      });
      const user = await this._UserRepository.findOne({
        filter: { _id: payload.id },
      });

      if (!user) throw new NotFoundException('User not found!');

      const tokenDoc = await this._TokenRepository.findOne({
        filter: { token, isValid: true, user: user._id },
      });
      if (!tokenDoc) throw new UnauthorizedException('Invalid token!');

      client.data.user = user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    const userId = client.data.user.id;
    this.socketUsers.set(userId, client);
    console.log('Client connected: ', client.id);
    console.log('Client connected: ', userId);
  }
  handleDisconnect(client: any) {
    const userId = client.data.user.id;
    this.socketUsers.delete(userId);
    console.log('Client disconnected: ', client.id);
    console.log('Client disconnected: ', userId);
  }

  broadcastStockUpdate(productId: Types.ObjectId, newStock: number) {
    this.server.emit('stock-update', { productId, stock: newStock });
  }

  @SubscribeMessage('get-data')
  async handleGetData(client: Socket, data: any) {
    console.log('Received event get-data');
  }
}
