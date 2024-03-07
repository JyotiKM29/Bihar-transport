import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({

    financeYear: { type: Date },
    createdBY: {
        _id: { type: String },
        name: { type: String },
    },
    updatedBY: {
        _id: { type: String },
        name: { type: String },
    },

}, { timestamps: true });

mongoose.models = {};
export default mongoose.model("setting", settingSchema);