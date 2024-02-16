const mongoose = require("mongoose");

// const consigneeConsignorSchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       enum: ["company", "personal"],
//        
//     },
//     consigneeName: String,
//     consignorName: String,
//     legalName: {
//       type: String,
//       validate: {
//         validator: function () {
//           return this.type === "company" ? this.isNew : true;
//         },
//         message: "Legal Name is required for company type",
//       },
//     },
//     gstin: {
//       type: String,
//       validate: {
//         validator: function () {
//           return this.type === "company" ? this.isNew : true;
//         },
//         message: "GSTIN is required for company type",
//       },
//     },
//     gstinStatus: {
//       type: String,
//       validate: {
//         validator: function () {
//           return this.type === "company" ? this.isNew : true;
//         },
//         message: "GSTIN Status is required for company type",
//       },
//     },
//     principalPlaceOfBusiness: String,
//     storeAddress: String,
//     officeNo: String,
//     creditLimit: Number,
//     defaultPaymentTerm: String,
//     payableReceivable: String,
//     accountGroup: String,
//     openingBalance: {
//       type: Number,
//       default: 0,
//     },
//     remarks: String,

//     aadharNo: {
//       type: String,
//       validate: {
//         validator: function () {
//           return this.type === "personal" ? this.isNew : true;
//         },
//         message: "Aadhar Number is required for personal type",
//       },
//     },
//     contactPerson: {
//       type: String,
//        
//     },
//     contactNo: {
//       type: String,
//        
//     },
//     address: {
//       type: String,
//        
//     },
//     dob: {
//       type: Date,
//       validate: {
//         validator: function () {
//           return this.type === "personal" ? this.isNew : true;
//         },
//         message: "Date of Birth is required for personal type",
//       },
//     },
//     designation: String,
//     email: {
//       type: String,
//        
//     },
//   },
//   { timestamps: true },
// );

const personalBookingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["personal"],

      default: "personal",
    },
    consignorName: {
      type: String,
    },
    contactNo: {
      type: String,
    },
    address: {
      type: String,
    },
    dob: {
      type: Date,
    },
    designation: String,
    email: {
      type: String,
    },
    remarks: String,
    booking: [],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const companyBookingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["company"],
       
      default: "company",
    },
    gstin: {
      type: String,
       
    },
    consignorName: {
      type: String,
       
    },
    legalName: {
      type: String,
       
    },
    gstinStatus: {
      type: String,
       
    },
    principalPlaceOfBusiness: String,
    storeAddress: String,
    email: {
      type: String,
    },
    officeNo: String,
    creditLimit: Number,
    defaultPaymentTerm: String,
    payableReceivable: String,
    accountGroup: String,
    openingBalance: {
      type: Number,
      default: 0,
    },
    booking: [],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);


const consigeeSchema = mongoose.Schema(

  {
    type: {
      type: String,
      enum: ["company", "personal"],
      required:true,
    },
    personal: personalBookingSchema,
    company: companyBookingSchema,

  });



mongoose.models = {};

export default mongoose.model("consigee", consigeeSchema);
