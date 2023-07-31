import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const batchShema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true
  },
  comment: {
    type: String
  },
  status: {
    type: String
  },
  totalCost: {
      type: Number
  },
  amountPaid: {
      type: Number
  },
  balance: {
      type: Number
  }
}, {
    timestamps: true,
    versionKey: false
});

const CardBatch = mongoose.model('CardBatch', batchShema, 'card_batch');

export default CardBatch;
