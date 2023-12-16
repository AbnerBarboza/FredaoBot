import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { X_DISCORD_TOKEN_ID } from 'src/shared/consts/headers';

export class CreateCardCMD {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
