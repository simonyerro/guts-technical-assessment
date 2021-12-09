import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    PortfolioModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/crypto-portfolio', {}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
