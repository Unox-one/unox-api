import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const deliveryShema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true
  },
  isBatched: {
    type: Boolean,
    required: true,
  },
  trackingId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "referencePath"
  },
  referencePath: {
    type: String,
    enum: ["Card", "CardBatch"]
  },
  email: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  company: {
    type: String,
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  status: {
    type: String
  },
}, {
    timestamps: true,
    versionKey: false
});

const Delivery = mongoose.model('Delivery', deliveryShema, 'delivery');

export default Delivery;
