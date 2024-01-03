import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: { type: String },
},{timestamps:true});


mongoose.models = {};
export default mongoose.model("user", userSchema);