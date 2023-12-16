import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  X_DISCORD_USER_ID,
  X_DISCORD_USER_ID_LOWER_CASE,
} from 'src/shared/consts/security-headers';

@Injectable()
export class DiscordGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'AllowAnonymous',
      context.getHandler(),
    );

    if (isPublic) {
      return Promise.resolve(true);
    }

    const req = context.switchToHttp().getRequest();
    return (
      req.headers[X_DISCORD_USER_ID] ||
      req.headers[X_DISCORD_USER_ID_LOWER_CASE]
    );
  }
}

export const AllowAnonymous = () => SetMetadata('AllowAnonymous', true);
