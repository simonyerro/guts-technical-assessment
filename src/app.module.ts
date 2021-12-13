import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AppController } from './app.controler';
import { ConfigModule } from '@nestjs/config';
import { LokiLoggerModule } from 'nestjs-loki-logger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PortfolioModule,
    MongooseModule.forRoot(
      `mongodb://root:${process.env.MONGODB_ROOT_PASSWORD}@${process.env.MONGODB_SVC_NAME}.default.svc.cluster.local:27017/portfolio?authSource=admin`,
    ),
    LokiLoggerModule.forRoot({
      lokiUrl: 'http://portfolio-loki.default.svc.cluster.local:3100',
      labels: {
        label: 'portfolio_backend',
      }
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
