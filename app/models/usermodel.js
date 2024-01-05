import mongoose from "mongoose";

var loginHistorySchema = new mongoose.Schema({
  ip: String ,
  location: String,
  loginTime: { type: Date, default: Date.now },
});


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: { type: Number, required: true },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isemailVerified: { type: Boolean, default: false },
    isphoneVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isOwner: { type: Boolean, default: false },
    ip: String, // New field for storing the current IP address
    loginHistory: [loginHistorySchema], // Array to store login history
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("user", userSchema);
