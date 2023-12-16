import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CardService } from './card.service';
import { CreateCardCMD } from './cmd/create-card.cmd';
import { CardDTO } from './dto/card.dto';
import { Throttle, minutes } from '@nestjs/throttler';
import { AllowAnonymous } from 'src/config/guard/discord/discord.guard';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';

@Controller('cards')
export class CardController {
  private readonly logger = new Logger(CardController.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly cardService: CardService,
  ) {}

  @Get('card/:id')
  @CacheTTL(30)
  @UseInterceptors(CacheInterceptor)
  findOne(@Param('id') id: number) {
    return `ok ${uuidv4()}`;
  }

  @Get('shuffle')
  @Throttle({ default: { limit: 10, ttl: minutes(10) } })
  async shuffle() {
    this.logger.log(await this.cacheService.store.keys('shuffle:*'));
    const uuid = uuidv4();
    this.cacheService.set(`shuffle:${uuid}`, `${uuid}`, 1000);
    return uuid;
  }

  @Post()
  @AllowAnonymous()
  @Throttle({ default: { limit: 100, ttl: minutes(5) } })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() card: CreateCardCMD,
    @UploadedFile() file: Express.MulterS3.File,
  ): CardDTO {
    return new CardDTO(1, card.title, card.description, file.location);
  }
}
