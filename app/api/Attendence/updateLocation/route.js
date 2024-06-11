import usermodel from "@/app/models/usermodel";
import vehicleAttendence from "@/app/models/vehicleAttendence";
import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";


export async function PUT(req, res) {
    

    try {

        const { attendenceId, updatedLocation, adminId } = await req.json();

        await connectDB();

        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        console.log(admin, adminId);
        
        if (!admin) return Response.json({ message: "Admin not found" }, { status: 404 });
        

        const updatedAttendence = await vehicleAttendence.findByIdAndUpdate(
            attendenceId,
            {
                $push: { location: updatedLocation },
                updatedBy: adminId,
            },
            { new: true },
        );

        if (!updatedAttendence) return Response.json({ message: "vehicle data not found" }, { status: 404 });
        
        return Response.json({ message: "Location updated successfully" }, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }



}