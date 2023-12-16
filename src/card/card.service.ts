import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CardDTO } from './dto/card.dto';
import { CreateCardCMD } from './cmd/create-card.cmd';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NoContentException } from 'src/shared/exceptions/no-content.excetion';
import {
  SHUFFLE_USER_CARD_PREFIX,
  SHUFFLE_USER_CONTROL_PREFIX,
} from 'src/shared/consts/redis';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async createCard(
    cardCMD: CreateCardCMD,
    image: string,
    token: string,
  ): Promise<CardDTO> {
    try {
      const card = await this.prisma.card.create({
        data: {
          title: cardCMD.title,
          description: cardCMD.description,
          image: image,
          token: token,
        },
      });
      return new CardDTO(card.id, card.title, card.description, card.image);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            `There is a unique constraint violation, conflicts: [${e?.meta?.target}]`,
          );
        }
      }
      throw e;
    }
  }

  async shuffle(userId: string, token: string): Promise<CardDTO> {
    const exclude = await this.cacheService.store.keys(
      `${SHUFFLE_USER_CARD_PREFIX}:*`,
    );
    const excludeIds =
      exclude
        .map((key) => Number(key.replace(`${SHUFFLE_USER_CARD_PREFIX}:`, '')))
        .filter((id) => !isNaN(id)) ?? [];

    const card = await this.prisma.card.findFirst({
      where: {
        AND: [
          {
            id: {
              notIn: excludeIds,
            },
          },
          {
            token: {
              equals: token,
            },
          },
        ],
      },
    });

    if (!card) {
      const key = `${SHUFFLE_USER_CONTROL_PREFIX}:/cards/shuffle:${userId}`;
      const value = await this.cacheService.get<number>(key);
      const ttl = await this.cacheService.store.ttl(key);
      await this.cacheService.set(key, (value || 0) - 1, { ttl } as any);
      throw new NoContentException();
    }

    await this.cacheService.set(`${SHUFFLE_USER_CARD_PREFIX}:${card.id}`, '', {
      ttl: 10 * 60,
    } as any);

    return new CardDTO(card.id, card.title, card.description, card.image);
  }
}
