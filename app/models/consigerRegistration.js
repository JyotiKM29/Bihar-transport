const mongoose = require("mongoose");

const consigneeConsignorSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["company", "personal"],
      required: true,
    },
    consigneeName: String,
    consignorName: String,
    legalName: {
      type: String,
      required: function () {
        return this.type === "company";
      },
    },
    gstin: {
      type: String,
      required: function () {
        return this.type === "company";
      },
    },
    gstinStatus: {
      type: String,
      required: function () {
        return this.type === "company";
      },
    },
    principalPlaceOfBusiness: String,
    storeAddress: String,
    officeNo: String,
    creditLimit: Number,
    defaultPaymentTerm: String,
    payableReceivable: String,
    accountGroup: String,
    openingBalance: {
      type: Number,
      default: 0,
    },
    remarks: String,

    aadharNo: {
      type: String,
      required: function () {
        return this.type === "personal";
      },
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: function () {
        return this.type === "personal";
      },
    },
    designation: String,
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const ConsigneeConsignor = mongoose.model(
  "ConsigneeConsignor",
  consigneeConsignorSchema,
);

module.exports = { ConsigneeConsignor };
