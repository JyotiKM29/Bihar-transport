import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hsnNo: { type: String, required: true, unique:true }, // Corrected to String type
  },
  { timestamps: true },
);

mongoose.models = {};
export default mongoose.model("Product", productSchema); // Changed model name to start with capital letter (convention)
