import mongoose from 'mongoose';


const typeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },
    lenght: {
        type: Number,
        required: true,
    },
    lenghtUnit: {
        type: String,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    widthUnit: {
        type: String,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    heightUnit: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    weightUnit: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    addedBy: {
        name: { type: String },
        adminId: { type: String }    
    },
    updatedBy: {
        name: { type: String },
        adminId: { type: String }
    }


}, { timestamps: true });


mongoose.models = {};
export default mongoose.model('type', typeSchema);