import bookingmodel from "@/app/models/bookingmodel";
import usermodel from "@/app/models/usermodel";
import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";


export async function POST(req, res) {


    try {
        const { adminId, vehicleNo, startDate, endDate } = await req.json();
        
        await connectDB();


        const vehicle = await vehicleModel.findOne({ vehicleNo });

        if (!vehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 404 });
        }

        
        







    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }










}