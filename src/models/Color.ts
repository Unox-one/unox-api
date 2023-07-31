import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const colorShema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const Color = mongoose.model("Color", colorShema, "color");

export default Color;
