import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CardService } from './card.service';
import { CreateCardCMD } from './cmd/create-card.cmd';
import { CardDTO } from './dto/card.dto';
import { Throttle, minutes } from '@nestjs/throttler';
import { AllowAnonymous } from 'src/config/guard/discord/discord.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { X_DISCORD_USER_ID } from 'src/shared/consts/security-headers';
import { X_DISCORD_TOKEN_ID } from 'src/shared/consts/headers';
import { RequestHeaders } from 'src/shared/decorators/request-headers.decorator';

@ApiTags('Cards')
@Controller('cards')
export class CardController {
  private readonly logger = new Logger(CardController.name);

  constructor(private readonly cardService: CardService) {}

  @Get('card/:id')
  @ApiOperation({})
  @CacheTTL(30)
  @UseInterceptors(CacheInterceptor)
  findOne(@Param('id') id: number) {
    return `ok ${uuidv4()}`;
  }

  @Get('shuffle')
  @ApiOperation({})
  @ApiBearerAuth(X_DISCORD_USER_ID)
  @Throttle({ default: { limit: 10, ttl: minutes(10) } })
  async shuffle(
    @RequestHeaders(
      X_DISCORD_TOKEN_ID,
      new ValidationPipe({ validateCustomDecorators: true }),
    )
    token: string,
  ): Promise<CardDTO> {
    return this.cardService.shuffle(token);
  }

  @Post()
  @ApiOperation({})
  @ApiConsumes('multipart/form-data')
  @AllowAnonymous()
  @Throttle({ default: { limit: 100, ttl: minutes(5) } })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @RequestHeaders(
      X_DISCORD_TOKEN_ID,
      new ValidationPipe({ validateCustomDecorators: true }),
    )
    token: string,
    @Body() cardCMD: CreateCardCMD,
    @UploadedFile() file: Express.MulterS3.File,
  ): Promise<CardDTO> {
    return await this.cardService.createCard(cardCMD, file.location, token);
  }
}
