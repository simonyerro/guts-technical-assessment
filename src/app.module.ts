import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PortfolioModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGOOSE_HOST}:27017/crypto-portfolio`,
      {},
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
