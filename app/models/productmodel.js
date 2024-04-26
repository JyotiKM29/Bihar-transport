import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hsnNo: { type: String, required: true, unique:true }, 
    packageGroup : { type: String},
      packageType: { type: String },
    
      weightType: { type: String },
      tax: { type: String },
      conversionFactor: { type: String },
  },
  { timestamps: true },
);

mongoose.models = {};
export default mongoose.model("Product", productSchema); // Changed model name to start with capital letter (convention)
