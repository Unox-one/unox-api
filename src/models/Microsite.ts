import mongoose from "mongoose";
const Schema = mongoose.Schema;

const micrositeSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    coverImage: {
        type: String
    },
    profileImage: {
        type: String
    },
    fullName: {
        type: String
    },
    title: {
        type: String
    },
    bio: {
        type: String
    },
    socialMedia: [{
        socialMediaType: {
            type: String
        },
        socialMediaLink: {
            type: String
        }
    }]
}, { 
    timestamps: true,
    versionKey: false
})


const Microsite = mongoose.model("Microsite", micrositeSchema, "microsite");

export default Microsite;
