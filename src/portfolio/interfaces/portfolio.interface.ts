import { Document } from 'mongoose';

export interface Portfolio extends Document {
  readonly invested: { quantity: number; currency: string };
  readonly data: Array<{ slug: string; quantity: number; where: string }>;
}
