import connectDB from "../../../middleware/connectDB";
import Vehicle from "../../../models/vehicleModel";
import usermodel from "../../../models/usermodel";


export async function POST(req, res) {

    try {
        
        const { adminId, vehicleType } = await req.json();
        await connectDB();

        const admin = await usermodel.find({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }



        const vehicle = await Vehicle.find({ vehicleType });

        // console.log(vehicle);

        const totalVehicle = vehicle.length;
        let totalBooking = 0;
        let commission = 0;
        let totalRevenue = 0;
        let totalDriverBhara = 0;

        //  



        vehicle.forEach((element) => {

            console.log(element.bookedBy);
            
            totalBooking += element.bookedBy.length;
            element.bookedBy.forEach((booking) => {
                commission += booking.commission;
                totalRevenue += booking.netBhara;
                totalDriverBhara += booking.driverBhara;
            });

        });

        const data = {
            totalVehicle,
            totalBooking,
            commission,
            totalRevenue,
            totalDriverBhara,
        };

        return Response.json(data, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }


}