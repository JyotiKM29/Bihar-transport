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

// const additionalChargeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   rate: { type: Number, },
//   qty: { type: Number, default: 1 },
//   amount: { type: Number, required: true },
//   enabled: { type: Boolean, default: true },
// });


const locationSchema = new mongoose.Schema({
  location: { type: String },
  time: { type: String, default: () => new Date().toLocaleTimeString() },
  date: { type: Date, default: Date.now },
  updatedBy: {
    adminId: { type: String },
    name: { type: String },
  }
});

const charge = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number },
  qty: { type: Number, default: 1 },
  amount: { type: Number, required: true },
  enabled: { type: Boolean, default: true },
});


const dispatchChargeSchema = new mongoose.Schema({
  chargesName: { type: String, required: true },
  days: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  remarks: { type: String },
});

const dispatchDetailsSchema = new mongoose.Schema({
  billtyType: { type: String },
  dispatchDate: { type: Date },
  dispatchTime: { type: String },
  totalFreight: { type: Number },
  consignorInvoiceDetails: {
    isPODCompulsory: { type: String },
    consignorInvoiceDate: { type: Date },
    consignorDeliveryNo: { type: String },
    consignorInvoiceNo: { type: String },
    valueOfGoods: { type: Number },
    eWayBillDetails: {
      eWayBillNo: { type: String },
      eWayBillDate: { type: Date },
      expDate: { type: Date },
    },
  },
  dispatch: {
    additionalRateForCompany: { type: Number },
    chargesDetails: [dispatchChargeSchema],
  },
  ledgerBalanceOfParty: { type: String },
  remarks: { type: String },
});

const dispatchAdditionalRateSchema = new mongoose.Schema({
  chargesName: { type: String, required: true },
  days: { type: Number, default: 1},
  rate: { type: Number, default: 0},
  amount: { type: Number,default: 0},
  remarks: { type: String },
});

const dispatchAdditionalDetailsSchema = new mongoose.Schema({
  deliveryType: { type: String },
  manualLRNo: { type: String },
  brokerCommission: { type: Number },
  shippingRisk: { type: String },
  insurance: {
    isInsured: { type: Boolean },
    insuranceProvider: { type: String },
    policyNo: { type: String },
    policyAmount: { type: Number },
    claimAmount: { type: Number },
    brokerDetails: {
    type: String,
    },
  },
});

const itemlistSchema = new mongoose.Schema({
  material: { type: String },
  hsnNo:{ type: String },
  
  
  quantity: { type: Number },
  rate: { type: Number },
  ammount: { type: Number },
  taxPercentage: { type: Number },
  quantityUnit: { type: String },
  actualWeight: { type: Number },
  actualWeightUnit: { type: String },
  chargedWeight: { type: Number },
  chargedWeightUnit: { type: String },
  rateAsPer: { type: String },
  rateAsPerOption: { type: String },
  rate: { type: Number },
  rateUnit: { type: String },
  taxPercentage: { type: Number },
  GSTType:{ type: String },
  basicAmount: { type: Number },

});

const additionalChargeSchema = mongoose.Schema({
  enabled: { type: Boolean, default: false },
  chargers: [charge],
  totalCharge: { type: Number },
});


const itemsListSchema = new mongoose.Schema({
  item: {
    type: [itemlistSchema], // Array of items
    default: [],
  },
  totalActualWeight: { type: Number, default: 0 }, // Total actual weight
  totalAmount: { type: Number, default: 0 }, // Total amount
});



const bookingSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true },
    date: { type: Date, default: Date.now },
    vehicleRequiredDate: { type: Date, default: Date.now },
    bookingType: { type: String },
    consignorName: { type: String, required: true },
    consignorMobileNumber: { type: Number },
    loadingPoints: [
      {
        type: String,
      },
    ],
    consigneeName: { type: String },
    consigneeMobileNumber: { type: Number },
    unloadingPoints: [
      {
        type: String,
      },
    ],
    way: { type: String, default: "One Way" },
    itemsList: itemsListSchema,

    vehicleType: { type: String, required: true },
    noOfVehicle: { type: Number },
    partyBhara: { type: Number, default: 0 },
    totalAdditionalChargeTax: { type: Number, default: 0 },
    totalAdditionalCharges: { type: Number, default: 0 },
    totalBillingAmount: { type: Number, default: 0 },
    vehicleType: { type: String },
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
    advanceAmount: { type: Number, default:0 },
    balanceAmount: { type: Number,},
    GSTPercentage: { type: Number },
    GSTType: { type: String, enum: ["RCM", "FCM"] },
    payMode: { type: String },
    transactionId: { type: String },
    remarks: { type: String },
    // additionalCharges: { type: String },
    additionalCharges: additionalChargeSchema,
    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Confirmed",
        "Initialized",
        "Dispatched",
        "In Transit",
        "Delivered",
        "Cancelled",
        "Restart",
      ],
    },
    isUrgent: { type: Boolean, default: false },
    allotedVehicle: [
      {
        vehicleId: { type: String },
        vehicleOwner: { type: String },
        vehicleDriver: { type: String },
        vehicleNo: { type: String },
        vehicleDriverPhone: { type: Number },
        vehicleOwnerPhone: { type: Number },
        date: { type: Date },
      },
    ],
    invoiceStatus: { type: Boolean, default: false },
    generatedInvoice: {
      invoiceNumber: { type: Number , unique:true},
      invoiceDate: { type: Date },
      invoiceAmount: { type: Number },
      invoiceGST: { type: Number },
      invoiceTotal: { type: Number },
      invoiceRemarks: { type: String },
    },
    reasonToCancel: { type: String },
    invoice: [],
    dispatch: {
      isDispatched: { type: Boolean, default: false },
      dispatchDetails: dispatchDetailsSchema,
      dispatchAdditionalDetails: dispatchAdditionalDetailsSchema,
      dispatchAdditionalRate: [dispatchAdditionalRateSchema],
    },
    paymentHistory: [],
    createdBy: {
      name: { type: String },
      adminId: { type: String },
      date: { type: Date, default: Date.now },
    },

    location: [locationSchema],

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
