import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        // required: true,
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

// [
//   {
//     productName: "ses",
//     itemSize: "12",
//     itemWeight: "12KG",
//     ETA: "133",
//     rate: 24,
//     rateAsPer: "sdgs",
//     Advance: 2,
//   },
// ];



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
               
            },
            customerName: {
                type: String,
               
            },
            customerAddress: {
                type: String,
              
            },
            customerMobileNo: {
                type: Number,
              
            },
            customerEmail: {
                type: String,
              
            },
            customerGSTIN: {
                type: String,
              
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