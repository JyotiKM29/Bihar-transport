import usermodel from "@/app/models/usermodel";
import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";


export async function GET(req, context) {

    try{

        const { vehicleNo } = context.params;
        
        await connectDB();
        const vehicleData = await vehicleModel.findOne({ vehicleNo: vehicleNo });

        if (!vehicleData) {
            return Response.json(
                { message: "Vehicle not found" },
                { status: 400 },
            );
        }

        return Response.json({ data:vehicleData }, { staus: 200 });

    }

    catch (error){

        consolelog(error);
        return Response.json({ message: error.message }, { status: 400 });

    }




}