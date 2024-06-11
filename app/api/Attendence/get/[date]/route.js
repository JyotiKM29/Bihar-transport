import usermodel from "@/app/models/usermodel";
import vehicleModel from "@/app/models/vehicleModel";
import vehicleAttendence from "@/app/models/vehicleAttendence";
import connectDB from "@/app/middleware/connectDB";


export async function GET(req, context) {

    try {
        
        const { date } = context.params;
        connectDB();

        const attendence = await vehicleAttendence.find({ createdAt: { $gte: new Date(date) } });        
        return Response.json(attendence, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({message:error.message},{status:400});
    }
    
}