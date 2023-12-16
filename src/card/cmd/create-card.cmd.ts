import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCardCMD {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
