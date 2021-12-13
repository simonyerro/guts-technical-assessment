import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  Query,
  NotFoundException,
  Delete,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDTO } from './dto/create-portfolio.dto';
import { LokiLogger } from 'nestjs-loki-logger';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}
  private readonly lokiLogger = new LokiLogger(PortfolioController.name);

  /** Add a portfolio */
  @Post('/create')
  async addPortfolio(@Body() createPortfolioDTO: CreatePortfolioDTO) {
    const portfolio = await this.portfolioService.addPortfolio(
      createPortfolioDTO,
    );
    const msg = 'Portfolio has been created successfully';
    this.lokiLogger.debug(
      'Portfolio has been created successfully',
      `${HttpStatus.OK}`,
    );
    return {
      message: msg,
      portfolio,
    };
  }

  /** Retrieve portfolios list */
  @Get('portfolios')
  async getAllPortfolio(@Res() res) {
    const portfolios = await this.portfolioService.getAllPortfolio();
    this.lokiLogger.debug(`portfolios retrieved ${HttpStatus.OK}`);
    return res.status(HttpStatus.OK).json(portfolios);
  }

  /** Fetch a particular portfolio using ID */
  @Get('portfolio/:portfolioID')
  async getPortfolio(@Res() res, @Param('portfolioID') portfolioID) {
    const portfolio = await this.portfolioService.getPortfolio(portfolioID);
    if (!portfolio) {
      const msg = `Portfolio ${portfolioID} not found`;
      this.lokiLogger.error(msg, `${HttpStatus.NOT_FOUND}`);
      throw new NotFoundException(msg);
    }
    this.lokiLogger.debug(
      `portfolio ${portfolioID} retrieved`,
      `${HttpStatus.OK}`,
    );
    return res.status(HttpStatus.OK).json(portfolio);
  }

  /** Compute value of a particular portfolio using Coinmarketcap API */
  @Get('value/:portfolioID')
  async getPortfolioValue(
    @Param('portfolioID') portfolioID,
    @Query('currency') currency,
  ) {
    const compute_value = await this.portfolioService.getPortfolioValue(
      portfolioID,
      currency,
    );
    if (!compute_value) {
      this.lokiLogger.error(
        `Portfolio does not exist`,
        `${HttpStatus.INTERNAL_SERVER_ERROR}`,
      );
      this.lokiLogger.debug(
        `portfolio ${portfolioID} value computed`,
        `${HttpStatus.OK}`,
      );
      throw new InternalServerErrorException(
        'Computing portfolio value went wrong!',
      );
    }
    return compute_value;
  }

  /** Update existing portfolio */
  @Put('/update')
  async updatePortfolio(
    @Query('portfolioID') portfolioID,
    @Body() createPortfolioDTO: CreatePortfolioDTO,
  ) {
    const portfolio = await this.portfolioService.updatePortfolio(
      portfolioID,
      createPortfolioDTO,
    );
    if (!portfolio) {
      const msg = `Portfolio ${portfolioID} not found`;
      this.lokiLogger.error(msg, `${HttpStatus.NOT_FOUND}`);
      throw new NotFoundException(msg);
    }
    const msg = `portfolio ${portfolioID} has been updated`;
    this.lokiLogger.debug(msg, `${HttpStatus.OK}`);
    return {
      message: msg,
      portfolio,
    };
  }

  /** Delete a portfolio */
  @Delete('/delete')
  async deletePortfolio(@Res() res, @Query('portfolioID') portfolioID) {
    const portfolio = await this.portfolioService.deletePortfolio(portfolioID);
    if (!portfolio) {
      const msg = `Portfolio ${portfolioID} not found`;
      this.lokiLogger.error(msg, `${HttpStatus.NOT_FOUND}`);
      throw new NotFoundException(msg);
    }
    const msg = `portfolio ${portfolioID} deleted`;
    this.lokiLogger.debug(msg, `${HttpStatus.OK}`);
    return {
      message: msg,
      portfolio,
    };
  }
}
