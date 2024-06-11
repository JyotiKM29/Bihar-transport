import mongoose from "mongoose";


// Define the schema for additional charges
const additionalChargeSchema = new mongoose.Schema({
  chargeName: { type: String, required: true },
  rate: { type: Number, required: true },
  qty: { type: Number, required: true },
  amount: { type: Number, required: true },
});

// Define the main schema
const priceSettingSchema = new mongoose.Schema({
    customer: { type: String, required: true },
    customerId:{type:String, required:true},
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  searchItemProduct: { type: String, required: true },
  way: {
    type: String,
    enum: ["One Way", "Two Way", "Returning"],
    required: true,
  },
  rateAsPer: {
    type: String,
    enum: ["Weight", "Quantity", "Distance", "Per Trip", "Fixed"],
    required: true,
  },

  // Weight details
  fromWeight: { type: Number },
  toWeight: { type: Number },
  weightUnit: { type: String },

  // Vehicle details
  vehicleType: { type: String },

  // Quantity details
  fromQty: { type: Number },
  toQty: { type: Number },
  qtyUnit: { type: String },

  // Distance details
  openingKM: { type: Number },
  closingKM: { type: Number },

  // Per trip details
  fromTrip: { type: Number },
  toTrip: { type: Number },

  // Rates
  partyRate: {
    rate: { type: Number },
    freight: { type: Number },
  },
  vehicleHireRate: {
    rate: { type: Number },
    freight: { type: Number },
  },
 

  // Additional charges
  additionalCharges: [additionalChargeSchema],
},{timestamps:true});

// Create the model

mongoose.models = {};
export default mongoose.model("PriceSetting", priceSettingSchema);
