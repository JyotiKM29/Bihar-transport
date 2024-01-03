import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: { type: String, required:true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  isemailVerified: { type: Boolean, default: false },
  isphoneVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isOwner:{type:Boolean, default:false},
},{timestamps:true});


mongoose.models = {};
export default mongoose.model("user", userSchema);