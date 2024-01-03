import mongoose  from "mongoose";

const connectDB = async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return  (req, res);
  } else {
    await mongoose.connect(process.env.URI);
    console.log("database connected");
    return  (req, res);
  }
};

export default connectDB;
