import usermodel from "@/app/models/usermodel";
import bookingmodel from "@/app/models/bookingmodel";
import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";

export async function POST(req, res) {
  try {
    const { paymentDetails, adminId, bookingId, vehicleId } = await req.json();

    console.log(paymentDetails, adminId, bookingId, vehicleId);

    await connectDB();
    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });

    if (!admin)
      return Response.json({ message: "admin not found" }, { status: 400 });

    // find the booking
    const booking = await bookingmodel.findOne({ _id: bookingId });

    if (!booking)
      return Response.json({ message: "booking not found" }, { status: 400 });

    const vehicle = await vehicleModel.findOne({ _id: vehicleId });

    if (!vehicle)
      return Response.json({ message: "vehicle not found" }, { status: 400 });

    if (vehicle.payment && vehicle.payment.length > 0) {
      vehicle.payment.push(paymentDetails);
    } else {
      vehicle.payment = [paymentDetails];
    }

    let bookingFound = false;
    let i = 0;

    for (; i < vehicle.bookedBy.length; i++) {
      if (vehicle.bookedBy[i].bookingId === bookingId) { // Correct condition
        bookingFound = true;
        break;
      }
    }

    if (bookingFound) {
      if (vehicle.bookedBy[i].payment && vehicle.bookedBy[i].payment.length > 0) {
        vehicle.bookedBy[i].payment.push(paymentDetails);
      } else {
        vehicle.bookedBy[i].payment = [paymentDetails];
      }

      vehicle.bookedBy[i].fine = paymentDetails?.fine;
      vehicle.bookedBy[i].totalPaidAmount += paymentDetails?.amountPaid;
      vehicle.bookedBy[i].balanceAmount = paymentDetails?.finalDue;

      const newVehicle = await vehicle.save();
      console.log(newVehicle);

      return Response.json({ message: "fuel details added successfully", newVehicle });
    }

    return Response.json({ message: "booking not found in vehicle's bookedBy list" }, { status: 400 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
