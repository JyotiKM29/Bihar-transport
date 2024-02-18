import mongoose from "mongoose"

const journalSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    voucherNo: {
      type: String,
      unique: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    debit: {
      type: Number,
    },
    credit: {
        type: Number,
        required: true,
    },
    narration: {
        type: String,
        required: true,
    },
    createdBy: {
      name: { type: String },
      adminId: { type: String },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
    updatedBy: [
      {
        name: { type: String },
        adminId: { type: String },
        date: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true },
);


// Define a pre-save middleware function
journalSchema.pre("save", async function (next) {
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
export default mongoose.model('journal', journalSchema);
