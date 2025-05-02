import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_GRAPHQL } from '../decorators/graphql.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

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

    const { user } = request;

    return requiredRoles.includes(user?.role);
  }
}
