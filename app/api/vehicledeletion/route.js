import { User } from "lucide-react";
import connectDB from "../../middleware/connectDB";
import vehicle from "../../models/vehiclemodel";
import user from "../../models/usermodel";

export async function DELETE(req, res) {
  try {
    await connectDB();

    const { adminId, _id }= await req.json();

    const admin = await user.findOne({ _id: adminId });
    if (admin && (admin.isAdmin || admin.isOwner)) {
      const existingVehicle = await vehicle.findOne({ _id });
      if (!existingVehicle) {
        return Response.json(
          { message: "Vehicle does not Exist" },
          { status: 400 },
        );
      }

        await vehicle.deleteOne({_id:existingVehicle._id});
        
      return Response.json(
        {
          message: "Vehicle deleted successfully",
        },
        { status: 200 },
      );
    } else {
      return Response.json(
        { message: "admin does not exist" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error deleting vehicle to the database:", error.message);

    return Response.json(
      {
        message: "Error while deleting vehicle from the database",
        error: error.message,
      },
      { status: 404 },
    );
  }
}

export async function GET(req, res) {
  return Response.json(
    {
      message: "Method Not Allowed",
    },
    { status: 405 },
  );
}


export async function PUT(req, res) {
  return Response.json(
    {
      message: "Method Not Allowed",
    },
    { status: 405 },
  );
}

export async function POST(req, res) {
  return Response.json(
    {
      message: "Method Not Allowed",
    },
    { status: 405 },
  );
}
