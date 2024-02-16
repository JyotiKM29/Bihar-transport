import mongoose from 'mongoose'

const receiptSchema = new mongoose.Schema({

    recieptNo: {
        type: String,
        required: true,
    },
    receivedFrom: {
        type: String,
        required: true,
    },
    recieptDate: {
        type: Date,
        default: Date.now,
    },
    receivedAmount: {
        type: Number,
        required: true,
    },
    TDS: {
        type: Number,
        required: true,
        default: 0,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    paidBy: {
        type: String,
        required: true,
    },
    narration: {
        type: String,
    },
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

}, { timestamps: true });


mongoose.models = {};
export default mongoose.model('receipt', receiptSchema);
