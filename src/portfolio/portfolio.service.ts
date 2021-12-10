import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from './interfaces/portfolio.interface';
import { CreatePortfolioDTO } from './dto/create-portfolio.dto';
import CoinMarketCap from 'coinmarketcap-api';

const cmc_api_key = process.env.COINMARKETCAP_API_KEY;

@Injectable()
export class PortfolioService implements OnModuleInit {
  private client = new CoinMarketCap(cmc_api_key);

  constructor(
    @InjectModel('Portfolio') private readonly portfolioModel: Model<Portfolio>,
  ) {}

  onModuleInit() {
    this.client = new CoinMarketCap(process.env.COINMARKETCAP_API_KEY);
  }

  /** Fetch all portfolios */
  async getAllPortfolio(): Promise<Portfolio[]> {
    const portfolios = await this.portfolioModel.find().exec();
    return portfolios;
  }
  /** Get a single portfolio */
  async getPortfolio(portfolioID): Promise<Portfolio> {
    const portfolio = await this.portfolioModel.findById(portfolioID).exec();
    return portfolio;
  }

  /** Compute portfolio value */
  async getPortfolioValue(portfolioID, currency): Promise<any> {
    const portfolio = await this.portfolioModel.findById(portfolioID).exec();
    const symbols = portfolio.data.map(function (token) {
      return token.symbol;
    });
    const quotes = await this.client.getQuotes({
      symbol: symbols,
      convert: currency,
    });
    const res = { quotes: {} };
    let total_value = 0;
    for (const symbol in quotes.data) {
      const token = portfolio.data.find((e) => e.symbol == symbol);
      const price = quotes.data[symbol].quote[currency].price;
      const value = token.quantity * price;
      total_value = total_value + value;
      res['quotes'][symbol] = {
        price: price,
        quantity: token.quantity,
        value: value,
        currency: currency,
      };
      res['total'] = {
        value: total_value,
        currency: currency,
        profit: total_value - portfolio.invested.quantity,
        ROI: total_value / portfolio.invested.quantity,
      };
    }
    return res;
  }

  /** Post a single portfolio */
  async addPortfolio(
    createPortfolioDTO: CreatePortfolioDTO,
  ): Promise<Portfolio> {
    const newPortfolio = await new this.portfolioModel(createPortfolioDTO);
    return newPortfolio.save();
  }
  /** Update portfolio info */
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
