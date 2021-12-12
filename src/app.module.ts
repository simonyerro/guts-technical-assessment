import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AppController } from './app.controler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PortfolioModule,
    MongooseModule.forRoot(
      // `mongodb://${process.env.MONGOOSE_HOST}:27017/crypto-portfolio`,
      `mongodb://root:${process.env.MONGODB_ROOT_PASSWORD}@mongodb.default.svc.cluster.local:27017/portfolio?authSource=admin`,
    ),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
