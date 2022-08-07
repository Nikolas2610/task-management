import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../user.entity';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log(requiredRoles)
    if (!requiredRoles) {
      return true;
    }
    // console.log(context.switchToHttp().getRequest())
    const request = context.switchToHttp().getRequest<User>();
    // const { user } = context.switchToHttp().getRequest();
    console.log(request.username)
    return requiredRoles.some((role) => request.role?.includes(role));
  }
}