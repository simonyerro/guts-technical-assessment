import * as mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  where: {
    type: String,
    required: false,
  },
});

export const PortfolioSchema = new mongoose.Schema({
  invested: {
    quantity: {
      type: Number,
      required: false,
    },
    currency: {
      type: String,
      required: false,
    },
  },
  data: {
    type: [TokenSchema],
    validate: [
      {
        validator: (v) => Array.isArray(v) && v.length > 0,
        msg: 'Empty or invalid array',
      },
    ],
  },
});
