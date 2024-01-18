import connectDB from "../../middleware/connectDB";
import Booking from "../../models/bookingmodel";
import user from "../../models/usermodel";

export async function DELETE(req, response) {
  try {
    const { adminId, _id } = await req.json();
    await connectDB();

    const admin = await user.findById(adminId);
    if (admin.isAdmin || admin.isOwner) {
      const booking = await Booking.findById(_id);
      if (!booking) {
        return response.json({ message: "Booking not found" }, { staus: 400 });
      }

      await Booking.findByIdAndDelete(_id);
      return response.json(
        { message: "Booking deleted successfully" },
        { status: 200 },
      );
    } else {
      return response.json({ message: "Admin not found" }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return response.json({ message: error.message }, { status: 400 });
  }
}



export function POST(req, res) {
    return Response.json({ message: "this method is not allowed here" }, { status: 405 });
}
export function PUT(req, res) {
  return Response.json(
    { message: "this method is not allowed here" },
    { status: 405 },
  );
}

export function GET(req, res) {
  return Response.json(
    { message: "this method is not allowed here" },
    { status: 405 },
  );
}