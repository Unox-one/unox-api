import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const fontShema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const Font = mongoose.model("Font", fontShema, "font");

export default Font;
