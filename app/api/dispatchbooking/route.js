import user from "../../models/usermodel";
import Booking from "../../models/bookingmodel"
import connectDB from "../../middleware/connectDB";
import Order from "../../models/orderModel";



export async function POST(req, res) {
    
    try {
        const { adminId, bookingId, dispatchDetails } = await req.json();
        await connectDB();

        const admin = await user.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) return Response.json({ message: "Invalid Admin Id" }, { status: 400 });
        
        const booking = await Booking.findOne({ _id: bookingId });
        if (!booking) return Response.json({ message: "Invalid Booking Id" }, { status: 400 });
        if (booking.status !== "Initialized") return Response.json({ message: "Booking is not confirmed" }, { status: 400 });
        if (booking.dispatch.isDispatched) return Response.json({ message: "Booking is already dispatched" }, { status: 400 });

        const existingOrder = await Order.findOne({ "booking.id": bookingId });
        if (!existingOrder) return Response.json({ message: "Order does not exist" }, { status: 400 });

        const newOrder = await Order.findOneAndUpdate(
          { "booking.id": bookingId },
          {
            dispatch: dispatchDetails,
            status: "Dispatched",
            updatedBy: {
              id: adminId,
              name: admin.name,
              date: new Date(),
            },
          },
          { new: true },
        );

        const updatedBooking = await Booking.findOneAndUpdate(
          { _id: bookingId },
          {
            dispatch: dispatchDetails,
            status: "Dispatched",
            updatedBy: [
              {
                name: admin.name,
                adminId: adminId,
                date: new Date(),
              },
            ],
          },
          { new: true },
        );


        return Response.json({ message: "Booking dispatched successfully", data: updatedBooking }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message },{status: 400})
    }



}

export function GET(req, res) {
    return Response.json({message:"This method is not allowed here"},{status: 405})
}