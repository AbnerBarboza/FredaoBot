import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../utils/multer.config';
import { CardsService } from './cards.service';
import { CreateCardsDto, UpdateCardsDto } from './dto/cards.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly usersService: CardsService) {}

  @Get()
  findAll() {
    const users = this.usersService.findAll();

    const randomIndex = Math.floor(Math.random() * users.length);

    const randomUser = users[randomIndex];

    return randomUser;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  create(
    @Body() createCardDto: CreateCardsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createCardDto.image = file.originalname;
    }

    return this.usersService.create(createCardDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardsDto) {
    return this.usersService.update(id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
