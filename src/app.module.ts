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
      // `mongodb://${process.env.MONGOOSE_HOST}:27017/crypto-portfolio`,
      `mongodb://root:${process.env.MONGODB_ROOT_PASSWORD}@${process.env.MONGODB_SVC_NAME}.default.svc.cluster.local:27017/portfolio?authSource=admin`,
    ),
    LokiLoggerModule.forRoot({
      lokiUrl: 'http://portfolio-loki.default.svc.cluster.local:3100', // loki server
      labels: {
        label: 'testing', // app level labels, these labels will be attached to every log in the application
      },
      logToConsole: false,
      gzip: false, // contentEncoding support gzip or not
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
