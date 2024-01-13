import { User } from "lucide-react";
import connectDB from "../../../middleware/connectDB";
// import vehicle from "../../models/vehiclemodel";
import user from "../../../models/usermodel";
import Booking from "../../../models/bookingmodel";

export async function GET(req,context) {
  try {
    await connectDB();
    console.log("yes");
    const { params } = context;

    const admin = await user.findOne({ _id: params.adminId });

    // console.log(admin);
    if (admin && (admin.isAdmin || admin.isOwner)) {
      // Create a new booking

      const data = await Booking.find();
      return Response.json(
        {
          data,
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
    console.error("Error getting Booking to the database:", error.message);

    return Response.json(
      {
        message: "Error adding booking ",
        error: error.message,
      },
      { status: 404 },
    );
  }
}

export async function POST(req, res) {
  return Response.json(
    {
      message: "Method Not Allowed",
    },
    { status: 405 },
  );
}
