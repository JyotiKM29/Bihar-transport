import mongoose from "mongoose";

const bulkRecieveSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    recieveFrom: {
      type: String,
      required: true,
    },
    recieveAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    remarks: {
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

mongoose.models = {};
export default mongoose.model("bulkRecieve", bulkRecieveSchema);
