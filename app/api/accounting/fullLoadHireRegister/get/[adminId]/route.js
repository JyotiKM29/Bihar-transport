import usermodel from "@/app/models/usermodel";
import bookingmodel from "@/app/models/bookingmodel";
import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";

export async function GET(req, context) {
  try {
    const { adminId } = context.params;
    console.log(adminId);

    await connectDB(); // Ensure you await the database connection

    // Check whether this id belongs to an admin or owner or not
    const admin = await usermodel.findOne({
      _id: adminId,
      $or: [{ isAdmin: true }, { isOwner: true }],
    });

    if (!admin)
      return new Response(JSON.stringify({ message: "Invalid Admin ID" }), {
        status: 400,
      });

    // Get all the bookings that don't have status pending, confirmed, or cancelled
    const bookings = await bookingmodel.find(
      {
        $nor: [
          { status: "Pending" },
          { status: "Confirmed" },
          { status: "Cancelled" },
          { status: "Restart" },
        ],
      },
      {
        _id: 1,
        allotedVehicle: 1,
        status: 1,
        orderNumber: 1,
        date: 1,
        loadingPoints: 1,
        unloadingPoints: 1,
        totalBillingAmount: 1,
        totalPaidAmount: 1,
        totalAdditionalCharges: 1,
        advanceAmount: 1,
        balanceAmount: 1,
        generatedInvoice: 1,
        invoiceStatus: 1,
        paymentHistory: 1,
        delivery: 1,
          location: 1,
        
      }, // Only select _id and allotedVehicle fields
    ).sort({_id:-1});

    // Get all the vehicles
    const vehicleData = [];
    for (let i = 0; i < bookings.length; i++) {
      // Initialize vehicleData array for each booking
      bookings[i] = bookings[i].toObject(); // Convert Mongoose document to plain JavaScript object
      bookings[i].vehicleData = {};

      // Check if allotedVehicle array exists and has at least one element
      if (bookings[i].allotedVehicle && bookings[i].allotedVehicle.length > 0) {
        const vehicleId = bookings[i].allotedVehicle[0].vehicleId;

        if (vehicleId) {
          const vehicle = await vehicleModel.findOne({ _id: vehicleId });

          if (vehicle) {
            // console.log("Vehicle found:", vehicle);
            bookings[i].vehicleData = vehicle;
            vehicleData.push(vehicle);
          } else {
            console.log("Vehicle not found for vehicleId:", vehicleId);
          }
        } else {
          console.log(
            "No vehicleId found in allotedVehicle for booking:",
            bookings[i]._id,
          );
        }
      } else {
        console.log("No allotedVehicle found for booking:", bookings[i]._id);
      }
    }

    return new Response(JSON.stringify({ bookings }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
}
