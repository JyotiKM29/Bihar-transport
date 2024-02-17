import Booking from "../../../models/bookingmodel";
import connectDB from "../../../middleware/connectDB";
import usermodel from "../../../models/usermodel";

export async function POST(req, res) {

    try {
        
        const {adminId, }






    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }




}
