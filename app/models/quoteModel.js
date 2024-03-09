import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    itemSize: {
        type: String,
    },
    itemWeight: {
        type: String,
    },
    ETA: {
        type: String,
    },
    rate: {
        type: Number,
    },
    rateAsPer: {
        type: String,
    },
    Advance: {
        type: Number,
    },

},{timestamps:true});



const quoteSchema = new mongoose.Schema(
    {

        quoteNo: {
            type: String,
            required: true,
            unique: true,
        },
        quoteDate: {
            type: Date,
            required: true,
        },
        quoteValidity: {
            type: Date,
            required: true,
        },
        customerDetails: {
            customerId: {
                type: String,
                required: true,
            },
            customerName: {
                type: String,
                required: true,
            },
            customerAddress: {
                type: String,
                required: true,
            },
            customerMobileNo: {
                type: Number,
                required: true,
            },
            customerEmail: {
                type: String,
                required: true,
            },
            customerGSTIN: {
                type: String,
                required: true,
            },
        },
        product: [productSchema],
        createdBy: {
            name: {
                type: String,
            },
            id: {
                type: String,
            },
        },
        updatedBy: [
            {
                name: {
                    type: String,
                },
                id: {
                    type: String,
                },
            },
        ],
    },{timestamps:true}
);

mongoose.models = {};
export default mongoose.model("Quote", quoteSchema);