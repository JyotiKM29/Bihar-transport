import mongoose from 'mongoose';


const typeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },
    length: {
        type: Number,
      
    },
    lengthUnit: {
        type: String,
     
    },
    width: {
        type: Number,
     
    },
    widthUnit: {
        type: String,
     
    },
    height: {
        type: Number,
     
    },
    heightUnit: {
        type: String,
     
    },
    weight: {
        type: Number,
      
    },
    weightUnit: {
        type: String,
     
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