import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PortfolioModule } from './portfolio/portfolio.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Portfolio backend api documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
    include: [PortfolioModule],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
