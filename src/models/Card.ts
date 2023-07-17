import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    type: {
        type: String,
        required: true
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
    color: {
        type: String
    },
    status: {
        type: String
    },
}, { 
    timestamps: true,
    versionKey: false
})

const Card = mongoose.model("Card", cardSchema, "card");

export default Card;
