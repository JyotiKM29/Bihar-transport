import connectDB from "../../../middleware/connectDB";
import Vehicle from "../../../models/vehicleModel";
import usermodel from "../../../models/usermodel";



export async function POST(req, res) {
    
    try {
        
        const { adminId, vehicleNo } = await req.json();
        await connectDB();

        const admin = await usermodel.find({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }

        const vehicle = await Vehicle.findOne({ vehicleNo });
        if (!vehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 400 });
        }

        let TotalBooking = vehicle.bookedBy.length;
        let cancelledBooking = vehicle.bookedBy.filter(
          (booking) => booking.status === "Cancelled",
        ).length;

        let pendingBooking = vehicle.bookedBy.filter(
          (booking) => booking.status === "Pending",
        ).length;

        let confirmedBooking = vehicle.bookedBy.filter(
          (booking) => booking.status === "Confirmed",
        ).length;

        let deleiveredBooking = vehicle.bookedBy.filter(
          (booking) => booking.status === "Delivered",
        ).length;

        let n = vehicle.bookedBy.length;
        let i = 0;
        let totalRevenue = 0;
        let totalCommision = 0;
        let totalDriverBhara = 0;

        while (i < n) {
            totalRevenue += vehicle.bookedBy[i].netBhara;
            totalCommision += vehicle.bookedBy[i].commission;
            totalDriverBhara += vehicle.bookedBy[i].driverBhara;
            i++;
        }


        const data = {
            TotalBooking,
            cancelledBooking,
            pendingBooking,
            confirmedBooking,
            deleiveredBooking,
            totalRevenue,
            totalCommision,
            totalDriverBhara
        }

        return Response.json({ data }, { status: 200 });


    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }

}
