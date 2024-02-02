import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    booking: {
        id: { type: String, required: true },
        date: { type: Date, required: true },
        client: {
            name: { type: String, required: true },
            phone: { type: Number, required: true },
        },

        loadingPoints: [
            {
                type: String,
            },
        ],
        unloadingPoints: [
            {
                type: String,
            },
        ],
    },
    vehicle: {
        id: { type: String, required: true },
        number: { type: String, required: true },
        driver: {
            name: { type: String, required: true },
            phone: { type: Number, required: true },
        },
        owner: {
            name: { type: String, required: true },
            phone: { type: Number, required: true },
        },
    },
    payment: {
        mode: { type: String, required: true },
        amount: { type: Number, required: true },
        advance: { type: Number, default: 0 },
        balance: { type: Number },
    },

    status: { type: String, required: true },
    isDelevered: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    createdBY: {
        id: { type: String, required: true },
        name: { type: String },
        date: { type: Date },
    },
    updatedBy: {
        id: { type: String, },
        name: { type: String,},
        date: { type: Date },
    },
}, { timestamps: true });

mongoose.models = [];
const Order = mongoose.model('Order', orderSchema)
export default Order;