import { redisStore } from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { CacheModule as CacheModule_ } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    CacheModule_.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        max: 10_000,
        store: (): any =>
          redisStore({
            commandsQueueMaxLength: 10_000,
            socket: {
              host: configService.get('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
            },
            username: configService.get('REDIS_USERNAME'),
            password: configService.get('REDIS_PASSWORD'),
          }),
      }),
    }),
  ],
})
export class CacheModule {}
