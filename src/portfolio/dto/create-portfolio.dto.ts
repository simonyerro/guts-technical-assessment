export class CreatePortfolioDTO {
  readonly invested: { quantity: number; currency: string };
  readonly data: Array<{ slug: string; quantity: number; where: string }>;
}
