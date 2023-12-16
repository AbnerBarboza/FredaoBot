import { Injectable } from '@nestjs/common';
import { CreateMarryCMD } from 'src/card/cmd/create-marry.cmd';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MarriageService {
  constructor(private readonly prisma: PrismaService) {}

  async marry(
    createMarryCMD: CreateMarryCMD,
    userId: string,
    channelId: string,
  ): Promise<void> {
    await this.prisma.marriage.create({
      data: {
        cardId: createMarryCMD.cardId,
        channelId,
        userId,
      },
    });
  }
}
