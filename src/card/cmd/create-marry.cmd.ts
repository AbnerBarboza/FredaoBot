import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMarryCMD {
  @IsNumber()
  @IsNotEmpty()
  readonly cardId: number;
}
