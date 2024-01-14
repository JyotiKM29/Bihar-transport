import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema(
  {
    ip: String,
    location: String,
    loginTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


const adminSchema = new mongoose.Schema({
  assignedBy: { type: String, required: true },
},
  { timestamps: true })

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
    emailToken: { type: String, default: null },
    emailTokenIssuedAt: { type: Date, default: null },
    emailTokenExpiresAt: { type: Date, default: null },
    isphoneVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    adminDetails: [adminSchema],
    isOwner: { type: Boolean, default: false },
    resetToken: { type: String, default: null },
    resetTokenIssuedAt: { type: Date, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
    loginHistory: [loginHistorySchema], // Array to store login history
  },
  { timestamps: true },
);

mongoose.models = {};
export default mongoose.model("user", userSchema);
