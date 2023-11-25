import { IsString } from 'class-validator';

export class CreateCardsDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly descripton: string;

  image: string;
}

export class UpdateCardsDto {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly descripton?: string;

  readonly image?: string;
}
