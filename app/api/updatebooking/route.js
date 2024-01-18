// pages/api/updateBooking.js
import Booking from "../../models/bookingmodel";
import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";

export async function PUT(req, res) {
  try {
    await connectDB();
    console.log("yes");

    const { _id, adminId, fieldsToUpdate } = await req.json();

    console.log(_id, adminId, fieldsToUpdate);

    const admin = await user.findOne({ _id: adminId });
    if (admin && (admin.isAdmin || admin.isOwner)) {
      const existingBooking = await Booking.findOne({ _id });
      if (!existingBooking) {
        return Response.json({ message: "Booking not found" }, { status: 400 });
      }

      const date = new Date();

      Object.keys(fieldsToUpdate).forEach((field) => {
        existingBooking[field] = fieldsToUpdate[field];
      });

       if (!existingBooking.updatedBy) {
         existingBooking.updatedBy = []; // Initialize if not present
       }
       existingBooking.updatedBy.push({
         name: admin.name,
         adminId: admin._id.toString(),
         date: date,
       });

      const updatedBooking = await existingBooking.save();

      console.log("Booking Updated:", updatedBooking);

      return Response.json(
        {
          message: "Booking updated successfully",
          booking: updatedBooking,
        },
        { status: 200 },
      );
    } else {
      return Response.json({ message: "Admin does not exist" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating booking:", error.message);

    return Response.json(
      {
        message: "Error updating booking in the database",
        error: error.message,
      },
      { status: 400 },
    );
  }
}

export async function GET(req, res) {
  return Response.json({ message: "Method Not Allowed" }, { status: 400 });
}


export async function POST(req, res) {
  return Response.json({ message: "Method Not Allowed" }, { status: 400 });
}
