import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardsDto, UpdateCardsDto } from './dto/cards.dto';

@Injectable()
export class CardsService {
  private cards = [];

  findAll() {
    return this.cards;
  }

  findOne(id: string) {
    const cards = this.cards.find((cards) => cards.id === id);
    if (!cards) {
      throw new NotFoundException('Cartão não encontrado');
    }
    return cards;
  }

  create(cardsData: CreateCardsDto) {
    const newCard = { id: (this.cards.length + 1).toString(), ...cardsData };
    this.cards.push(newCard);
    return newCard;
  }

  update(id: string, updateCardsDto: UpdateCardsDto) {
    const card = this.findOne(id);
    if (updateCardsDto.title) {
      card.title = updateCardsDto.title;
    }
    if (updateCardsDto.descripton) {
      card.descripton = updateCardsDto.descripton;
    }
    return card;
  }

  remove(id: string) {
    const index = this.cards.findIndex((card) => card.id === id);
    if (index === -1) {
      throw new NotFoundException('Cartão não encontrado');
    }
    const deletedUser = this.cards.splice(index, 1);
    return deletedUser;
  }
}
