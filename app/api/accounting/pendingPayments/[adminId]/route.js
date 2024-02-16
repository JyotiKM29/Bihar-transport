import connectDB from "../../../../middleware/connectDB";
import Booking from "../../../../models/bookingmodel";
import user from "../../../../models/usermodel";

export async function GET(req, context) {
    
    try {
        
        await connectDB();
        const { params } = context;
        const admin = await user.findOne({
            $and: [
                { _id: params.adminId },
                { $or: [{ isAdmin: true }, { isOwner: true }]
            }]
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }

        const pendingPayments = await Booking.find({ status: "Pending" });
        return Response.json({ message: "Pending payments fetched successfully", data: pendingPayments }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }





}