import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { MarriageService } from './marriage.service';
import { CreateMarryCMD } from 'src/card/cmd/create-marry.cmd';
import {
  X_DISCORD_CHANNEL_ID,
  X_DISCORD_USER_ID,
} from 'src/shared/consts/security-headers';
import { RequestHeaders } from 'src/shared/decorators/request-headers.decorator';
import { Throttle, minutes } from '@nestjs/throttler';

@Controller('marriages')
export class MarriageController {
  constructor(private readonly marriagesService: MarriageService) {}

  @Post('marry')
  @Throttle({ default: { limit: 1, ttl: minutes(10) } })
  async marry(
    @RequestHeaders(
      X_DISCORD_CHANNEL_ID,
      new ValidationPipe({ validateCustomDecorators: true }),
    )
    channelId: string,
    @RequestHeaders(
      X_DISCORD_USER_ID,
      new ValidationPipe({ validateCustomDecorators: true }),
    )
    userId: string,
    @Body()
    createMarryCMD: CreateMarryCMD,
  ) {
    await this.marriagesService.marry(createMarryCMD, userId, channelId);
  }
}
