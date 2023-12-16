import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from './config/guard/discord/discord.guard';

@Controller()
export class AppController {
  @Get()
  @AllowAnonymous()
  health() {
    return {
      status: 'UP',
    };
  }
}
