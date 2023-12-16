import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CardController],
  providers: [CardService, PrismaService],
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const s3Client = new S3Client({
          region: configService.getOrThrow<string>('aws.region'),
          endpoint: configService.get('aws.endpoint'),
          credentials: {
            accessKeyId: configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.getOrThrow<string>(
              'AWS_SECRET_ACCESS_KEY',
            ),
          },
        });

        return {
          storage: multerS3({
            s3: s3Client,
            bucket: 'fredao-bucket',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            key: (req, file, cb) => {
              const extension = path.parse(file.originalname).ext;
              cb(null, `${uuidv4()}${extension}`);
            },
          }),
        };
      },
    }),
  ],
})
export class CardModule {}
