import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    addedBy: {
      name: { type: String },
      id: { type: String, required: true },
      date: { type: Date, default: Date.now }, // Change made here
    },
  },
  { timestamps: true },
);

mongoose.models = {};
export default mongoose.model("Unit", unitSchema);
