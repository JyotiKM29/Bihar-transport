import vehicle from "../../models/vehicleModel";
import Booking from "../../models/bookingmodel";
import Order from "../../models/orderModel";
import connectDB from "../../middleware/connectDB";
import user from "../../models/userModel";
import { log } from "console";

export async function POST(req, res) {

    try {
        await connectDB();
        const { bookingId, vehicleId, adminId } = await req.json();

        const admin = await user.findById(adminId);
        const vehicle = await vehicle.findById(vehicleId);
        const booking = await Booking.findById(bookingId);
    } catch (error) {
        console.log(error);
        return Response.json(
          { message: error.message },
          { status: 400 },
        );
    }
    


}






export async function GET(req, res) {
  return Response.json({ msg: "This method is not allowed" }, { status: 400 });
}


export async function PUT(req,res) {
  return Response.json({ msg: "This method is not allowed" }, {status:400});
}
