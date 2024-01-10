import mongoose from "mongoose";

// Custom validator to ensure exactly two URLs for driverSchema
const validateDriverProof = function (value) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((url) => typeof url === "string" && url.trim().length > 0)
  );
};

// Custom validator to ensure at most two URLs for proof fields
const validateProof = function (value) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((url) => typeof url === "string" && url.trim().length > 0)
  );
};

// driver schema
const driverSchema = new mongoose.Schema(
  {
    licenseNo: { type: String, required: true },
    name: { type: String, required: true },
    issueDate: { type: Date },
    licenceValidity: { type: Date },
    DOB: { type: Date },
    vehicleClass: { type: String },
    licenceAuthority: { type: String },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    altPhone: { type: Number },
    rating: { type: Number },
    smartPhone: { type: Boolean, default: true },
    owner: { type: Boolean, default: false },
    proof: {
      type: [
        {
          type: String,
        },
      ],
      validate: {
        validator: validateDriverProof,
        message: "Proof array must contain exactly two URLs.",
      },
    },
    remarks: { type: String },
  },
  { timestamps: true },
);

// bank information
const bankSchema = new mongoose.Schema(
  {
    upiNo: { type: Number },
    name: { type: String },
    accNo: { type: Number },
    ifscCode: { type: String },
    proof: {
      type: [
        {
          type: String,
        },
      ],
      validate: {
        validator: validateDriverProof,
        message: "Proof array must contain exactly two URLs.",
      },
    },
  },
  { timestamps: true },
);
// owner information
const ownerSchema = new mongoose.Schema(
  {
    proofType: { type: String, required: true },
    proofNumber: { type: String, required: true },
    name: { type: String, required: true },
    DOB: { type: Date },
    phone: { type: Number, required: true },
    secondPhone: { type: Number },
    address: { type: String, required: true },
    rating: { type: Number, required: true },
    withPhone: { type: Boolean, default: true },
    // Bank Details
    bank: [bankSchema],
    remarks: { type: String },
  },
  { timestamps: true },
);

// Custom validator to ensure a non-empty string for rcPhoto
const validateRcPhoto = function (value) {
  return typeof value === "string" && value.trim().length > 0;
};

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNo: { type: String, required: true },
    registrationAuthority: { type: String, required: true },
    fuelName: { type: String, required: true },
    vehicleAge: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleClass: { type: String, required: true },
    vehicleLength: { type: String, required: true },
    passingCapacity: { type: String, required: true },
    maxCapacity: { type: String, required: true },
    lockedStatus: { type: String, required: true },
    chassisNo: { type: String, required: true },
    EngineNo: { type: String, required: true },
    fitnessValidUpTo: { type: Date, required: true },
    taxPaidUpTo: { type: Date, required: true },
    insurenceValidUpTo: { type: Date, required: true },
    permitValidUpTo: { type: Date, required: true },
    nationalPermit: { type: Boolean, required: true },
    nationalPermitValidUpTo: { type: Date, required: true },
    vehicleStatus: { type: String, required: true },
    rcPhoto: {
      type: String,
      validate: {
        validator: validateRcPhoto,
        message: "rcPhoto must be a non-empty string (URL).",
      },
    },
    Remark: { type: String, required: true },
    // owner Details
    owner: [ownerSchema],
    driver: [driverSchema],
  },
  { timestamps: true },
);

mongoose.models = [];
export default mongoose.model("vehicle", vehicleSchema);
