import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { X_DISCORD_USER_ID } from 'src/shared/consts/security-headers';

@Injectable()
export class ThrottlerPerUserGuard extends ThrottlerGuard {
  getTracker(req: Record<string, any>) {
    return (
      req.headers[X_DISCORD_USER_ID] ||
      req.headers[X_DISCORD_USER_ID.toLowerCase()]
    );
  }
}
