import { User } from 'lucide-react';
import connectDB from '../../middleware/connectDB';
import vehicle from '../../models/vehiclemodel';

export async function POST(req, res) {
  
    try {
        await connectDB();

        const {
            vehicleNo,
            registrationAuthority,
            fuelName,
            vehicleAge,
            vehicleType,
            vehicleClass,
            vehicleLength,
            passingCapacity,
            maxCapacity,
            lockedStatus,
            chassisNo,
            EngineNo,
            fitnessValidUpTo,
            taxPaidUpTo,
            insurenceValidUpTo,
            permitValidUpTo,
            nationalPermit,
            nationalPermitValidUpTo,
            vehicleStatus,
            rcPhoto,
            Remark,
            owner,
            driver,
        } = await req.json();


        const existingVehicle = await vehicle.findOne({ vehicleNo });

        if (existingVehicle) {
            

            return Response.json({ message: "Vehicle already Exist" },{status:400});

        }





        const newVehicle = new vehicle({
            vehicleNo,
            registrationAuthority,
            fuelName,
            vehicleAge,
            vehicleType,
            vehicleClass,
            vehicleLength,
            passingCapacity,
            maxCapacity,
            lockedStatus,
            chassisNo,
            EngineNo,
            fitnessValidUpTo,
            taxPaidUpTo,
            insurenceValidUpTo,
            permitValidUpTo,
            nationalPermit,
            nationalPermitValidUpTo,
            vehicleStatus,
            rcPhoto,
            Remark,
            owner,
            driver,
        });

        console.log(newVehicle);

        const result = await newVehicle.save();

        console.log("Vehicle added to the database:", result);

        return Response.json(
            {
                message: "Vehicle added successfully",
                vehicle: result,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error adding vehicle to the database:", error.message);

        return Response.json(
            {
                message: "Error adding vehicle to the database",
                error: error.message,
            },
            { status: 404 },
        );
    }
}

export async function GET(req, res) {
    return Response.json(
        {
            message: "Method Not Allowed",
        },
        { status: 405 },
    );
}
 
    
  

