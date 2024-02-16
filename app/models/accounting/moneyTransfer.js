import mongoose from 'mongoose'


const moneyTransferSchema = new mongoose.Schema({

    from: {
        type: String,
        required:true,
    },
    to: {
        type: String,
        required:true,
    },
    amount: {
        type: Number,
        required:true,
    },
    transferDate: {
        type: Date,
        default: Date.now
    },
    narration: {
        type: String,
    },

});

mongoose.models = {};
export default mongoose.model('moneyTransfer', moneyTransferSchema);
