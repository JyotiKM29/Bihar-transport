const mongoose = require('mongoose');


const additionalContactSchema = new mongoose.Schema({
  proofType: { type: String },
  proofNumber: { type: String },
  name: { type: String },
  DOB: { type: Date },
  SDWOf: { type: String },
  ContactNo: { type: Number },
  alternativeContactNo: { type: Number },
  Address: { type: String },
  designation: { type: String },
  email: { type: String },
  proofPhoto: { type: String },
});


const ledgerSchema = new mongoose.Schema({
  basicInfo: {
    accountName: String,
    contactNo: Number,
    officeAddress: String,
    taxInfo: {
      GSTIN: String,
      PanNo: String,
      tradeName: String,
      legalName: String,
      GSTINStatus: String,
      principalPlaceOfBusiness: String,
      rating: String,
      remarks: String,
      additionalContact: String,
      alert: Boolean,
    },
  },
  accountDetails: {
    accountGroup: String,
    natureOfAccount: String,
    openingBalance: {
      amount: Number,
      debitCredit: String, //dropdown
    },
    creditLimit: Number,
  },
  additionalInfo: {
    tripType: String,
    route: String,
    defaultPaymentTerm: String,
    serviceToStates: String,
    typeOfVehicle: String,
    attachId: String,
   
  },
  additionalContact: [additionalContactSchema],
  
  bankDetails: {
    bankName: String,
    nameOnPassbook: String,
    accountNo: String, //number
    IFSCCode: String,
    branch: String,
    upiNo: String,
    upiType: String,
  },
  // GSTINAadharCardPanCardDrivingLicence: String, //dropdown
  createdBy: {
    id: String,
    name: String,
    date: Date,
  },
  updatedBy: [
    {
      id: String,
      name: String,
      date: Date,
    },
  ],
  booking: [],
  totalAmount: {
    type: Number,
    default: 0,
  },
  paymentHistory:[],
  advanceAmount: {
    type: Number,
    default: 0,
  },
  isActive:{
    type: Boolean,
    default: true
  },
});

mongoose.models = {};
const ledger = mongoose.model('Ledger', ledgerSchema);
export default ledger;
