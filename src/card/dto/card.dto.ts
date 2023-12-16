import { IsString } from 'class-validator';

export class CardDTO {
  constructor(id: number, title: string, descripton: string, image: string) {
    this.id = id;
    this.title = title;
    this.description = descripton;
    this.image = image;
  }
  readonly id: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly image: string;
}
