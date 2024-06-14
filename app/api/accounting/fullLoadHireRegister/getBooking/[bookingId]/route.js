import usermodel from "@/app/models/usermodel";
import bookingmodel from "@/app/models/bookingmodel";
import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";

export async function GET(req, context) {
  try {
    const { bookingId } = context.params;
    console.log("Booking ID:", bookingId);

    await connectDB(); // Ensure you await the database connection

    // Get the booking by ID
    let bookings = await bookingmodel.findOne(
      {
        _id: bookingId,
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
        date: 1,
      }
    );

    if (!bookings) {
      console.log("Invalid booking ID");
      return new Response(JSON.stringify({ message: "Invalid booking ID" }), {
        status: 400,
      });
    }

    const newData = bookings;

    console.log("Bookings found:", bookings);
    bookings.vehicleData = {};
    newData.vehicleData = {};

    let vehicle;

    if (bookings.allotedVehicle && bookings.allotedVehicle.length > 0) {
      const vehicleId = bookings.allotedVehicle[0].vehicleId;
      console.log("Vehicle ID:", vehicleId);

      if (vehicleId) {
        vehicle = await vehicleModel.findOne({ _id: vehicleId });
        console.log("Vehicle found:", vehicle);

        if (vehicle) {
          // Filter the bookedBy array to include only the relevant bookingId
          vehicle.bookedBy = vehicle.bookedBy.filter(
            (booking) => booking.bookingId === bookings._id.toString()
          );

          console.log("Filtered bookedBy:", vehicle.bookedBy);

          newData.vehicleData = vehicle;
        } else {
          console.log("No vehicle found for the given ID");
        }
      } else {
        console.log("Vehicle ID is undefined");
      }
    } else {
      console.log("AllotedVehicle is empty or undefined");
    }

    const data = {
      bookings,
      vehicle
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
    });
  } catch (error) {
    console.log("Error:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
}
