import { Module } from '@nestjs/common';
import { CardModule } from 'src/card/card.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from './config/cache/cache.module';
import { ThrottlerModule, minutes } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { APP_GUARD } from '@nestjs/core';
import Redis from 'ioredis';
import { ThrottlerPerUserGuard } from './config/guard/throttler-per-user/throttler-per-user.guard';
import { DiscordGuard } from './config/guard/discord/discord.guard';
import { configuration } from './config/env/configuration';
import { validationSchema } from './config/env/validations';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    CardModule,
    CacheModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): any => ({
        throttlers: [{ limit: 100, ttl: minutes(5) }],

        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            username: configService.get('REDIS_USERNAME'),
            password: configService.get('REDIS_PASSWORD'),
          }),
        ),
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerPerUserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: DiscordGuard,
    },
  ],
})
export class AppModule {}
