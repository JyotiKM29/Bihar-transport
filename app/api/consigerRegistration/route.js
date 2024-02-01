import connectDB from "../../middleware/connectDB";
import Consignor from "../../models/consignormodel";
import User from "../../models/usermodel";

export default async function POST(req, res) {
  try {
    await connectDB();

      const { adminId, consignorData } = await req.json();
    
    // Check if adminId is present
    if (!adminId) {
      return Response.json({ message: "adminId is required" }, { status: 400 });
    }
    
    // Check if an admin or owner exists
    const adminOrOwner = await User.findOne({
      _id: adminId,
      $or: [{ isAdmin: true }, { isOwner: true }],
    });
    if (!adminOrOwner) {
      return Response.json(
        { message: "Admin or owner does not exist" },
        { status: 400 },
      );
      }
      
    // Check if the consignor already exists
    const existingConsignor = await Consignor.findOne({
      consignorName: consignorData.consignorName,
    });
    if (existingConsignor) {
      return Response.json(
        { message: "Consignor already exists" },
        { status: 400 },
      );
    }


    // Create a new consignor with all the fields from the frontend
    const newConsignor = new Consignor({
      ...consignorData,
    });

    // Save the new consignor
    const savedConsignor = await newConsignor.save();

    console.log("Consignor Created:", savedConsignor);

    return Response.json(
      {
        message: "Consignor creation successful",
        consignor: savedConsignor,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error while creating consignor:", error.message);

    return Response.json(
      {
        message: "Error creating consignor",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
