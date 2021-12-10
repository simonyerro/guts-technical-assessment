import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from './interfaces/portfolio.interface';
import { CreatePortfolioDTO } from './dto/create-portfolio.dto';
import CoinMarketCap from 'coinmarketcap-api';

// const cmc_api_key = process.env.COINMARKETCAP_API_KEY;
// const client = new CoinMarketCap(cmc_api_key);
// const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1';

@Injectable()
export class PortfolioService implements OnModuleInit {
  private client: CoinMarketCap;

  constructor(
    @InjectModel('Portfolio') private readonly portfolioModel: Model<Portfolio>,
  ) {}

  onModuleInit() {
    this.client = new CoinMarketCap(process.env.COINMARKETCAP_API_KEY);
  }

  // fetch all portfolios
  async getAllPortfolio(): Promise<Portfolio[]> {
    const portfolios = await this.portfolioModel.find().exec();
    return portfolios;
  }
  // Get a single portfolio
  async getPortfolio(portfolioID): Promise<Portfolio> {
    const portfolio = await this.portfolioModel.findById(portfolioID).exec();
    return portfolio;
  }

  async getPortfolioValue(portfolioID, currency): Promise<any> {
    const portfolio = await this.portfolioModel.findById(portfolioID).exec();
    const slugs = portfolio.data.map(function (token) {
      return token.slug;
    });
    const data = await this.client.simple.price({
      ids: slugs,
      vs_currencies: [currency],
    });
    // const quotes = await client.getQuotes({ symbol: slugs, convert: currency });
    return data;
  }

  // post a single portfolio
  async addPortfolio(
    createPortfolioDTO: CreatePortfolioDTO,
  ): Promise<Portfolio> {
    const newPortfolio = await new this.portfolioModel(createPortfolioDTO);
    return newPortfolio.save();
  }
  // Update portfolio info
  async updatePortfolio(
    portfolioID,
    createPortfolioDTO: CreatePortfolioDTO,
  ): Promise<Portfolio> {
    const updatedPortfolio = await this.portfolioModel.findByIdAndUpdate(
      portfolioID,
      createPortfolioDTO,
      { new: true },
    );
    return updatedPortfolio;
  }
  /** Delete a portfolio */
  async deletePortfolio(portfolioID): Promise<any> {
    const deletedPortfolio = await this.portfolioModel.findByIdAndRemove(
      portfolioID,
    );
    return deletedPortfolio;
  }
}
