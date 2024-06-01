import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";


export async function POST(req, res) {
    

    const { vehicleNo } = await req.json()

    await connectDB();

    const vehicle = await vehicleModel.findOne({ vehicleNo });


    vehicle.bookedBy.forEach((booking) => {
        if (!booking.balanceAmount) {
           booking.balanceAmount = booking.netBhara;
        }

    });



    await vehicle.save();

    return Response.json({ vehicle });

}