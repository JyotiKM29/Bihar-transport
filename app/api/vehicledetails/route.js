import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import vehicle from "../../models/vehicleModel";

export async function POST(req, res) {        
    try {
    await connectDB();
        const { _id, adminId } = await req.json();
        
        const admin = await user.findOne({ "_id": adminId });
        if(!admin || !(admin.isAdmin || admin.isOwner)){            
            return Response.json({ message: "User not authorized" }, { status: 400 });
        }

        const newVehicle = await vehicle.findOne({ _id: _id });

        if (!newVehicle) {
          return Response.json(
            { message: "Vehicle not found" },
            { status: 400 },
          );
        }

        return Response.json({ newVehicle }, { staus: 200 });
    } catch (error) {
        
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}