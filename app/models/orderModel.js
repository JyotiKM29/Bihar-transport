import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    booking: {
        id: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        client: {
            name: { type: String, required: true },
            phone: { type: Number, required: true },
            address: { type: String, required: true },
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
        type: { type: String, required: true },
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
    },

    status: { type: String, required: true },
    createdBY: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        date: { type: Date },
    },
    updatedBY: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        date: { type: Date },
    },
}, { timestamps: true });

mongoose.models = [];
const Order = mongoose.model('Order', orderSchema)
export default Order;