import usermodel from "@/app/models/usermodel";
import connectDB from "@/app/middleware/connectDB";
import vehicleAttendence from "@/app/models/vehicleAttendence";
import vehicleModel from "@/app/models/vehicleModel";

export async function POST(req, res) {


    try {
        
        const { vehicleNo, vehicleType, vehicleLength, passingWeight, carryWeight, driverMobileNo, ownerMobileNo, fromAddress, specificRoutes, currentLocation, inTime, outTime, remarks } = await req.json();
        connectDB();

        const vehicle = await vehicleModel.findOne({ vehicleNo: vehicleNo });

        if (!vehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 400 });
        }

         const attendence = new vehicleAttendence({
           vehicleNo,
           vehicleType,
           vehicleLength,
           passingWeight,
           carryWeight,
           driverMobileNo,
           ownerMobileNo,
           fromAddress,
           specificRoutes,
           location: [currentLocation], // Initialize location as an array with currentLocation
           inTime,
           outTime,
           remarks,
         });

         await attendence.save();

        return Response.json({ message: "Vehicle attendence created" }, { status: 200 });







    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
    







}