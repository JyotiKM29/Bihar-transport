import mongoose from "mongoose";


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

const orderSchema = new mongoose.Schema(
  {
    booking: {
      id: { type: String, required: true },
      date: { type: Date, required: true },
      client: {
        name: { type: String, required: true },
        phone: { type: Number, required: true },
      },
      loadingPoints: [
        {
          type: String,
        },
      ],
      unloadingPoints: [
        {
          type: String,
        },
      ],
    },
    vehicle: {
      id: { type: String, required: true },
      number: { type: String, required: true },
      driver: {
        name: { type: String, required: true },
        phone: { type: Number, required: true },
      },
      owner: {
        name: { type: String, required: true },
        phone: { type: Number, required: true },
      },
    },
    payment: {
      mode: { type: String, required: true },
      amount: { type: Number, required: true },
      advance: { type: Number, default: 0 },
      balance: { type: Number },
    },
    status: { type: String, required: true },
    isDelevered: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    dispatch: {
      isDispatched: { type: Boolean, default: false },
      dispatchDetails: dispatchDetailsSchema,
      dispatchAdditionalDetails: dispatchAdditionalDetailsSchema,
      dispatchAdditionalRate: [dispatchAdditionalRateSchema],
    },
    createdBY: {
      id: { type: String, required: true },
      name: { type: String },
      date: { type: Date },
    },
    updatedBy: {
      id: { type: String },
      name: { type: String },
      date: { type: Date },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

mongoose.models = [];
const Order = mongoose.model("Order", orderSchema);
export default Order;
