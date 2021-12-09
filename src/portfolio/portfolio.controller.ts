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
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDTO } from './dto/create-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  // add a portfolio
  @Post('/create')
  async addPortfolio(
    @Res() res,
    @Body() createPortfolioDTO: CreatePortfolioDTO,
  ) {
    const portfolio = await this.portfolioService.addPortfolio(
      createPortfolioDTO,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Portfolio has been created successfully',
      portfolio,
    });
  }

  // Retrieve portfolios list
  @Get('portfolios')
  async getAllPortfolio(@Res() res) {
    const portfolios = await this.portfolioService.getAllPortfolio();
    return res.status(HttpStatus.OK).json(portfolios);
  }

  // Fetch a particular portfolio using ID
  @Get('portfolio/:portfolioID')
  async getPortfolio(@Res() res, @Param('portfolioID') portfolioID) {
    const portfolio = await this.portfolioService.getPortfolio(portfolioID);
    if (!portfolio) throw new NotFoundException('Portfolio does not exist!');
    return res.status(HttpStatus.OK).json(portfolio);
  }

  @Put('/update')
  async updatePortfolio(
    @Res() res,
    @Query('portfolioID') portfolioID,
    @Body() createPortfolioDTO: CreatePortfolioDTO,
  ) {
    const portfolio = await this.portfolioService.updatePortfolio(
      portfolioID,
      createPortfolioDTO,
    );
    if (!portfolio) throw new NotFoundException('Portfolio does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Portfolio has been successfully updated',
      portfolio,
    });
  }

  // Delete a portfolio
  @Delete('/delete')
  async deletePortfolio(@Res() res, @Query('portfolioID') portfolioID) {
    const portfolio = await this.portfolioService.deletePortfolio(portfolioID);
    if (!portfolio) throw new NotFoundException('Portfolio does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'Portfolio has been deleted',
      portfolio,
    });
  }
}
