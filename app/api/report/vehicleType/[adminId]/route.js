import usermodel from "../../../../models/usermodel";
import Vehicle from "../../../../models/vehicleModel";
import connectDB from "../../../../middleware/connectDB";


export async function GET(req, context) {
    
    try {
        
        const { adminId } = context.params;
        await connectDB();

        const admin = await usermodel.find({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }


      const uniqueVehicleTypes = await Vehicle.distinct("vehicleType");

      return Response.json(uniqueVehicleTypes, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }



}