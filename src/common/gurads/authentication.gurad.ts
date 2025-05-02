import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenRepository } from 'src/DB/repositories/token.repository';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IS_GRAPHQL } from '../decorators/graphql.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _ConfigService: ConfigService,
    private readonly _UserRepository: UserRepository,
    private readonly _TokenRepository: TokenRepository,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    let request;
    const isGraphql = this.reflector.getAllAndOverride<boolean>(IS_GRAPHQL, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isGraphql) {
      const ctx = GqlExecutionContext.create(context).getContext();
      request = ctx.req;
    } else {
      request = context.switchToHttp().getRequest();
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = this._jwtService.verify(token, {
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
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
