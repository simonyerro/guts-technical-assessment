import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PortfolioModule } from './portfolio/portfolio.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('Documentation about the portfolio API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [PortfolioModule],
  });
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
