import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    unique: true,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true,
    index: true
  },
  sentTo: {
    type: String
  }
}, {
  timestamps: true, 
  versionKey: false 
});

const UserToken = mongoose.model("UserToken", userTokenSchema, "user_token");

export default UserToken;
