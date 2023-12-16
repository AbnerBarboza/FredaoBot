import { Module } from '@nestjs/common';
import { MarriageService } from './marriage.service';
import { MarriageController } from './marriage.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [MarriageController],
  providers: [MarriageService, PrismaService],
})
export class MarriagesModule {}
