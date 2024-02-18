import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    voucherNo: {
      type: Number,
      unique: true, // Ensure uniqueness
    },

    paymentDate: {
      type: Date,
      default: Date.now(),
    },

    paidTo: {
      vehicleId: { type:String }, // Corrected type definition
      vehicleNo: { type: String },
      ownerName: { type: String },
      driverName: { type: String },
    },

    paidAmount: {
      type: Number,
      required: true,
    },
    TDS: {
      type: Number,
    },

    paidBy: {
      type: String,
      enum: ["BANK", "CASH", "SBI"],
    },

    narration: {
      type: String,
    },

    createdBy: {
      name: { type: String },
      adminId: { type: String },
      date: {
        type: Date,
        date: Date.now(),
      },
    },
    updatedBy: [{
      name: { type: String },
      adminId: { type: String },
      date: {
        type: Date,
      },
    }],
  },
  { timestamps: true },
);


// Define a pre-save middleware function
voucherSchema.pre("save", async function (next) {
  // Generate a random number between 1000 and 9999
  const min = 1000;
  const max = 9999;
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

  let existingVoucher = await this.constructor.findOne({
    voucherNo: randomNum,
  });

  while (existingVoucher) {
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    existingVoucher = await this.constructor.findOne({ voucherNo: randomNum });
  }

  // Assign the unique random number to the voucherNo field
  this.voucherNo = randomNum;

  next();
});


mongoose.models = {};
export default mongoose.model("voucher", voucherSchema);