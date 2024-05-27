import connectDB from "../../../middleware/connectDB";
import Vehicle from "../../../models/vehicleModel";
import usermodel from "../../../models/usermodel";
import bookingmodel from "@/app/models/bookingmodel";

export async function POST(req, res) {
  try {
    const { adminId, vehicleNo } = await req.json();
    await connectDB();

    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });
    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 400 });
    }

    const vehicle = await Vehicle.findOne({ vehicleNo });
    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 400 });
    }

    console.log(vehicle);

    let TotalBooking = vehicle.bookedBy.length;
    const statusData = {
      Pending: 0,
      Confirmed: 0,
      Initialized: 0,
      Dispatched: 0,
      InTransit: 0,
      Delivered: 0,
      Cancelled: 0,
      Restart: 0,
    };

    async function updateStatusData() {
      for (const booking of vehicle.bookedBy) {

        const actualStatus = await bookingmodel.findOne(
          { _id: booking.bookingId },{status:1}
        );

        if(!actualStatus){
          continue;
        }
        // console.log(booking.bookingId,": ", actualStatus);

        // console.log(actualStatus);

        if (actualStatus.status === "Pending") {
          statusData.Pending++;
        }
        if (actualStatus.status === "Confirmed") {
          statusData.Confirmed++;
        }
        if (actualStatus.status === "Initialized") {
          statusData.Initialized++;
        }
        if (actualStatus.status === "Dispatched") {
          statusData.Dispatched++;
        }
        if (actualStatus.status === "InTransit") {
          statusData.InTransit++;
        }
        if (actualStatus.status === "Delivered") {
          statusData.Delivered++;
        }
        if (actualStatus.status === "Cancelled") {
          statusData.Cancelled++;
        }
        if (actualStatus.status === "Restart") {
          statusData.Restart++;
        }
      }
    }

    // Call the async function and wait for it to complete
    await updateStatusData();

    let totalRevenue = 0;
    let totalCommision = 0;
    let totalDriverBhara = 0;

    for (const booking of vehicle.bookedBy) {
      totalRevenue += booking.netBhara;
      totalCommision += booking.commission;
      totalDriverBhara += booking.driverBhara;
    }

    const data = {
      TotalBooking,
      statusData,
      totalRevenue,
      totalCommision,
      totalDriverBhara,
    };

    // console.log(data);

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
