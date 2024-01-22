// models/bookingModel.js

import mongoose from "mongoose";

// const pointSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["Point"],
//     required: true,
//   },
//   coordinates: {
//     type: [Number],
//     required: true,
//   },
// });

// const loadingPointSchema = new mongoose.Schema({
//   location: { type: String},
// });

// const unloadingPointSchema = new mongoose.Schema({
//   location: { type: String },
// });

// Add 2dsphere index to enable spatial queries
// loadingPointSchema.index({ "location.coordinates": "2dsphere" });
// unloadingPointSchema.index({ "location.coordinates": "2dsphere" });

// const additionalChargeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   amount: { type: Number, required: true },
// });

const bookingSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    vehicleRequiredDate: { type: Date, default: Date.now },
    consignorName: { type: String, required: true },
    consignorMobileNumber: { type: String },
    loadingPoints: [
      {
        type: String,
      },
    ],
    consigneeName: { type: String },
    consigneeMobileNumber: { type: String },
    unloadingPoints: [
      {
        type: String,
      },
    ],
    way: { type: String, default: "One Way" },
    material: { type: String, required: true },
    quantity: { type: Number, required: true },
    quantityUnit: { type: String, required: true },
    vehicleType: { type: String, required: true },
    actualWeight: { type: Number, required: true },
    chargedWeight: { type: Number, required: true },
    rateAsPer: { type: String, default: "Fixed" },
    rate: { type: Number },
    rateUnit: { type: String },
    partyBhara: { type: Number, default: 0 },
    hideBhara: { type: Boolean, default: false },
    paymentLiability: {
      type: String,
      enum: ["Consignor", "Consignee", "Third Party", "Vehicle Owner"],
    },
    billTo: { type: String },
    paymentTerm: {
      type: String,
      enum: ["Advance", "Paid", "To Pay", "To be Billed"],
    },
    advanceAmount: { type: Number },
    balanceAmount: { type: Number },
    payMode: { type: String },
    transactionId: { type: String },
    remarks: { type: String },
    additionalCharges: { type: String },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Initialized", "on the way", "delevered", "cancelled"],
    },
    isUrgent: { type: Boolean, default: false },
    allotedVehicle: [
      {
        vehicleId: { type: String },
        vehicleOwner: { type: String },
        vehicleDriver: { type: String},
        vehicleNo: { type: String},
        vehicleDriverPhone: { type: Number},
        vehicleOwnerPhone: { type: Number},
        date: { type: Date },
      },
    ],
    createdBy: {
      name: { type: String },
      adminId: { type: String },
      date: { type: Date, default: Date.now },
    },
    updatedBy: [
      {
        name: { type: String },
        adminId: { type: String },
        date: { type: Date },
      },
    ],
  },
  { timestamps: true },
);

// Add 2dsphere index to enable spatial queries
bookingSchema.index({ "loadingPoints.location.coordinates": "2dsphere" });
bookingSchema.index({ "unloadingPoints.location.coordinates": "2dsphere" });

mongoose.models = [];
export default mongoose.model("Booking", bookingSchema);
