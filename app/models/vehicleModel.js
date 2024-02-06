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
    image: {
      type: [
        {
          type: String,
        },
      ],
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
    image: {
      type: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true },
);

// Custom validator to ensure a non-empty string for rcPhoto
const validateRcPhoto = function (value) {
  return typeof value === "string" && value.trim().length > 0;
};


const allotmentSchema = new mongoose.Schema(
  {
    bookingId:{type:String,required:true},
    vehicleType: { type: String, required: true },
    ownerDetails: {
      ownerName: { type: String, required: true },
      ownerMobNo: { type: Number, required: true },
    },
    arrangedBy: { type: String, required: true },
    transporterDetails: {
      personName: { type: String },
      transporterMobNo: { type: Number },
    },
    ledgerBalance: { type: String }, // Assuming it can be both debit or credit

    rateAsPer: {
      type: String,
      enum: ["fixed", "weight", "distance"],
      required: true,
    },
    rate: { type: String }, // Show only if rateAsPer is not "fixed"
    driverBhara: { type: Number },
    commission: { type: Number },
    netBhara: { type: Number }, // Calculated as (Driver Bhara - Commission)

    paymentLiability: {
      type: String,
      enum: ["Consignor", "Consignee", "Third Party"],
      required: true,
    },
    billTo: {
      type: String,
      // enum: ["Consignor", "Consignee", "Third Party"],
      // required: function () {
      //   return this.paymentLiability === "Third Party";
      // },
    },
    ledgerBalanceParty: { type: String }, // Assuming it can be both debit or credit

    remarks: { type: String },
  },
  { _id: false }, // To exclude this subdocument from having its own _id
);

const transporterDetailsSchema = new mongoose.Schema(
  {
    vehicleGuarantor: {
      type: String,
      enum: ["Self", "Others"],
      required: true,
    },
    ifOther: {
      proofType: { type: String },
      proofNumber: { type: String },
      name: { type: String },
      dob: { type: Date },
      sDWOf: { type: String },
      mobileNo: { type: Number },
      alternateMobNo: { type: Number },
      officeAddress: { type: String },
      temporaryAddress: { type: String },
      permanentAddress: { type: String },
      serviceToState: { type: String },
      transporterRating: { type: Number },
      typeOfVehicle: { type: String },
    },
    bankDetails: {
      bankName: { type: String },
      nameOnPassbook: { type: String },
      accountNo: { type: Number },
      ifscCode: { type: String },
      upiNo: { type: Number },
      upiType: { type: String },
    },
    transporterVisitingCardProof: {
      type: [
        {
          type: String,
        },
      ],
    },
    remarks: { type: String },
    multipleContacts: [
      {
        contactPerson: { type: String },
        mobileNo: { type: Number },
        designation: { type: String },
      },
    ],
    image: {
      type: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true },
);



const vehicleSchema = new mongoose.Schema(
  {
    vehicleNo: { type: String, required: true },
    registrationAuthority: { type: String, required: true },
    fuelName: { type: String, required: true },
    vehicleAge: { type: Number, required: true },
    vehicleType: { type: String, required: true },
    vehicleClass: { type: String, required: true },
    vehicleLength: { type: String, required: true },
    passingCapacity: { type: String, required: true },
    maxCapacity: { type: String, required: true },
    chassisNo: { type: String, required: true },
    EngineNo: { type: String, required: true },
    fitnessValidUpTo: { type: Date, required: true },
    taxPaidUpTo: { type: Date, required: true },
    insurenceValidUpTo: { type: Date, required: true },
    permitValidUpTo: { type: Date, required: true },
    nationalPermit: { type: Boolean },
    nationalPermitValidUpTo: { type: Date, required: true },
    transporterDetails: [transporterDetailsSchema],
    allotmentStatus: { type: Boolean, default: false },
    rcPhoto: {
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
    Remark: { type: String, required: true },
    bookedBy: [allotmentSchema],
    // owner Details
    owner: ownerSchema,
    driver: driverSchema,
    addedBy: [
      {
        // Details for owner or admin
        name: { type: String, required: true },
        adminId: { type: String, required: true },
        // Add more fields as needed
      },
    ],

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


// Adding timestamps for each entry in the updatedBy array
// vehicleSchema.path('updatedBy').schema.add({ timestamps: true });

mongoose.models = [];
export default mongoose.model("vehicle", vehicleSchema);
