import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from './interfaces/portfolio.interface';
import { CreatePortfolioDTO } from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel('Portfolio') private readonly portfolioModel: Model<Portfolio>,
  ) {}
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
  // post a single portfolio
  async addPortfolio(
    createPortfolioDTO: CreatePortfolioDTO,
  ): Promise<Portfolio> {
    const newPortfolio = await new this.portfolioModel(createPortfolioDTO);
    return newPortfolio.save();
  }
  // Edit portfolio details
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
  // Delete a portfolio
  async deletePortfolio(portfolioID): Promise<any> {
    const deletedPortfolio = await this.portfolioModel.findByIdAndRemove(
      portfolioID,
    );
    return deletedPortfolio;
  }
}
