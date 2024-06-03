import Booking from "../../../../models/bookingmodel";
import user from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";


export async function POST(req, res) {
    

    try {
        const { adminId } = await req.json();
        await connectDB();


        const admin = await user.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        
        if(!admin){
            return Response.json({ message: "Admin not found or missing required fields" }, { status: 400 });
        }

        const booking = await Booking.find({ $and: [{ invoiceStatus: false }, { status: "Delivered" }] });
        console.log(booking.length);
        return Response.json({ message: "Invoice Generated", booking }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 })
    }



}