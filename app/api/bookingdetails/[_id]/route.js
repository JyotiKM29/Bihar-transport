import user from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";
import Booking from "../../../models/bookingmodel";

export async function GET(req, context) {        
    try {
    await connectDB();
    const { params } = context;

    // check if owner exists
        const booking = await Booking.findById(params._id);
        if(!booking){
            return Response.json({message:"Booking not found"},{staus:400});
        }
        
     return Response.json({ booking }, { staus: 200 });
    } catch (error) {
        
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}