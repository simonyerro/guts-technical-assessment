import { ValidateNested } from 'class-validator';

export class tokenDTO {
  slug: string;
  quantity: number;
  where: string;
}

export class CreatePortfolioDTO {
  readonly invested: { quantity: number; currency: string };
  @ValidateNested()
  readonly data: tokenDTO[];
}
