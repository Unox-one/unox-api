import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cardTypeSchema = new Schema({
    template: {
        type: String,
        enum: ["branded", "custom", "team"],
        required: true
    }
}, { 
    timestamps: true,
    versionKey: false
})

const CardType = mongoose.model("CardType", cardTypeSchema, "card_type");

export default CardType;
