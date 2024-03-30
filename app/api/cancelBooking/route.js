import Booking from "../../models/bookingmodel";
import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";


export async function POST(req, res) {
    
    try {
        
        const { bookingId, adminId, reason } = await req.json();

        await connectDB();
        const admin = await user.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }


        const booking = await Booking.findOne({ _id: bookingId });
        if (!booking) {
            return Response.json({ message: "Booking not found" }, { status: 404 });
        }

        if (booking.status === "Cancelled") {
            return Response.json({ message: "Booking already cancelled" }, { status: 400 });
        }

        booking.status = "Cancelled";
       
        const data = {
            name: admin.name,
            id: admin._id,
            reason: reason,
            action: "Cancelled",
            date: Date.now()
        };

        booking.updatedBy.push(data);

        await booking.save();


        return Response.json({ message: "Booking cancelled successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
  
}


