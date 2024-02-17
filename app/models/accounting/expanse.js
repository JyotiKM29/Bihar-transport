import mongoose from "mongoose"

const expenseCategorySchema = new mongoose.Schema(
    {
        name:"string",
    }
);

const expanseSchema = new mongoose.Schema(
    {

        date: {
            type: Date,
            default: Date.now(),
        },
        expenseCategory: {
            type: String,
            required: true,
        },
        serviceAccount: {
            ledgerId: { type: String },
            ledgerName: { type: String },
        },
        serviceCharge: {
            type: Number,
        },
        paidAmount: {
            type: Number,
            required: true,
        },
        paidBy: {
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
        updatedBy: [{
            name: { type: String },
            adminId: { type: String },
            date: {
                type: Date,
            },
        }],
    }, { timestamps: true });
    


mongoose.models = {};
const expanseCategory = mongoose.model('expanseCategory', expenseCategorySchema);
const expanse = mongoose.model('expanse', expanseSchema);

export {expanseCategory,expanse}