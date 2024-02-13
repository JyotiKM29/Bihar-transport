const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  basicInfo: {
    accountName: String,
    contactNo: String,
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
      additionalContact: String
    }
  },
  accountDetails: {
    accountGroup: String,
    natureOfAccount: String,
    openingBalance: {
      amount: Number,
      debitCredit: String
    },
    creditLimit: Number,
    defaultPaymentTerm: String,
    serviceToStates: String,
    typeOfVehicle: String,
    attachId: String,
    alert: String
  },
  additionalInfo: {
    tripType: String,
    route: String,
    proofType: String,
    proofNumber: String,
    name: String,
    DOB: Date,
    SDWOf: String,
    proofContactNo: String,
    proofAddress: String,
    designation: String,
    email: String
  },
  bankDetails: {
    bankName: String,
    nameOnPassbook: String,
    accountNo: String,
    IFSCCode: String,
    branch: String,
    upiNo: String,
    upiType: String
  },
  GSTINAadharCardPanCardDrivingLicence: String
});

mongoose.models = {};
const Ledger = mongoose.model('Ledger', ledgerSchema);
export default Ledger;
