import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  X_DISCORD_CHANNEL_ID,
  X_DISCORD_USER_ID,
} from 'src/shared/consts/security-headers';

@Injectable()
export class DiscordGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'AllowAnonymous',
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest();

    if (isPublic) {
      return Promise.resolve(true);
    }

    return (
      (req.headers[X_DISCORD_USER_ID] ||
        req.headers[X_DISCORD_USER_ID.toLocaleLowerCase()]) &&
      (req.headers[X_DISCORD_CHANNEL_ID] ||
        req.headers[X_DISCORD_CHANNEL_ID.toLocaleLowerCase()])
    );
  }
}

export const AllowAnonymous = () => SetMetadata('AllowAnonymous', true);
