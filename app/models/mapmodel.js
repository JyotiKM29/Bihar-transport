import mongoose from "mongoose";

const mapSchema = new mongoose.Schema(
  {
    access_token:{type:Object},
  },
  { timestamps: true },
);

const Map = mongoose.model("Map", mapSchema); // Create the model directly

export default Map;
