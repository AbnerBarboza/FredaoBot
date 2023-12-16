import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { X_DISCORD_USER_ID } from './shared/consts/security-headers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Fredão Bot API')
    .setDescription('API Fredão Bot baseada nas funcionalidades do MUDAE Bot')
    .setVersion('1.0')
    .addApiKey(
      {
        name: 'X-Discord-User-ID',
        description: 'User ID from Discord',
        in: 'header',
      } as SecuritySchemeObject,
      X_DISCORD_USER_ID,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
}
bootstrap();
