import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule } from 'src/card/card.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from './config/cache/cache.module';
import { ThrottlerModule, minutes, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { APP_GUARD } from '@nestjs/core';
import Redis from 'ioredis';
import { ThrottlerPerUserGuard } from './config/guard/throttler-per-user/throttler-per-user.guard';
import { DiscordGuard } from './config/guard/discord/discord.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  controllers: [AppController],
  providers: [
    AppService,
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
