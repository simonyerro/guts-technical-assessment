import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { LokiLogger } from 'nestjs-loki-logger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  private readonly lokiLogger = new LokiLogger(AppController.name);

  @Get()
  redirect(@Res() res) {
    return res.redirect('/api');
  }

  @Get('status')
  healthCheck(@Res() res) {
    if (this.connection.readyState === 1) {
      res.status(HttpStatus.OK).json({ db: { status: 'up' } });
      this.lokiLogger.debug(`db accessible ${HttpStatus.OK}`);
    } else {
      this.lokiLogger.error(
        `db not accessible ${HttpStatus.INTERNAL_SERVER_ERROR}`,
      );
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ db: { status: 'down' } });
    }
  }
}