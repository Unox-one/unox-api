import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    batch: {
        type: Schema.Types.ObjectId,
        ref: "CardBatch",
        index: true,
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: "CardType",
        index: true,
        required: true
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: "Color",
        index: true,
    },
    font: {
        type: Schema.Types.ObjectId,
        ref: "Font",
        index: true,
    },
    quantity: {
        type: Number
    },
    displayName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    url: {
        type: String
    },
    status: {
        type: String
    },
    cost: {
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
})

const Card = mongoose.model("Card", cardSchema, "card");

export default Card;
