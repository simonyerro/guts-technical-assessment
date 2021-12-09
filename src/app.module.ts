import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PortfolioModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/crypto-portfolio', {}),
    // MongooseModule.forRoot('mongodb://mongodb:27017/crypto-portfolio', {}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
