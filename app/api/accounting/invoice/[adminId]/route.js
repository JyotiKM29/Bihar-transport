import connectDB from "../../../../middleware/connectDB";
import Booking from "../../../../models/bookingmodel";
import user from "../../../../models/usermodel";


export async function GET(req, context) {

    try {
        
        const _id = context.params.adminId;
        await connectDB();
        console.log(_id);

        // const admin = await user.findOne({ $and: [{ _id }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        const admin = await user.findOne({ _id });


        console.log(admin);

        if (!admin) {
            return Response.json({ message: "Admin not found or missing required fields" }, { status: 400 });
        }


        const booking = await Booking.find({ invoiceStatus: true });
        
        return Response.json({ message: "Invoice Generated", booking }, { status: 200 });





    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }


}