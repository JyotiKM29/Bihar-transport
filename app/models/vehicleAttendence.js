import mongoose from "mongoose";


const AttendanceSchema = new mongoose.Schema({
  vehicleNo: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleLength: {
    type: String,
    required: true,
  },
  passingWeight: {
    type: String,
    required: true,
  },
  carryWeight: {
    type: String,
    required: true,
  },
  driverMobileNo: {
    type: String,
    required: true,
  },
  ownerMobileNo: {
    type: String,
    required: true,
  },
  fromAddress: {
    type: String,
    required: true,
  },
  specificRoutes: {
    type: String,
    required: true,
  },
  currentLocation: {
    type: String,
    required: true,
  },
  inTime: {
    type: Date,
    required: true,
  },
  outTime: {
    type: Date,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
});

mongoose.models = {};
export default mongoose.model("Attendance", AttendanceSchema);