import vehicle from "../../models/vehicleModel";
import Booking from "../../models/bookingmodel";
import Order from "../../models/orderModel";
import connectDB from "../../middleware/connectDB";
import user from "../../models/usermodel";

export async function POST(req, res) {
  try {
    await connectDB();
    const {
      orderNo,
      vehicleNo,
      adminId,
      ledgerBalance,
      paymentLiability,
      // billTo,
      ledgerBalanceParty,
      remarks,
      

      // after changes
      DriverDetails,
      arrangedBy,
      arrangedByName,
      arrangedByPhoneNo,
      billTo,
      date,
      materialDetails,
      recievableLiability,
    } = await req.json();

    const admin = await user.findById(adminId);
    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 404 });
    }

    const existingVehicle = await vehicle.findOne({ vehicleNo: vehicleNo });

    if (!existingVehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 404 });
    }
    const existingBooking = await Booking.findOne({ orderNumber: orderNo });

    if (!existingBooking) {
      return Response.json({ message: "Booking not found" }, { status: 404 });
    }

    if (existingBooking.status === "Initialized") {
      return Response.json(
        { message: "Booking is already initialized" },
        { status: 400 },
      );
    }

    if (existingBooking.status === "Pending") {
      existingBooking.status = "Confirmed";
    }

    if (existingBooking.status !== "Confirmed") {
      console.log(existingBooking.status);
      return Response.json(
        { message: "Booking is not confirmed" },
        { status: 400 },
      );
    }

    if (
      existingBooking.allotedVehicle.length &&
      existingBooking.allotedVehicle.length > 0
    ) {
      return Response.json(
        { message: "Booking is already allotted" },
        { status: 400 },
      );
    }

    console.log(existingBooking.itemsList);

    // Get the actual weight from materialDetails
    const actualWeight = materialDetails.actualWgt;

    // Update the totalWeight calculation to use actualWeight
    let totalWeight = actualWeight;

    // Modify the logic to handle vehicle filled weight
    if (
      existingVehicle.filledWeight + actualWeight >
      existingVehicle.maxCapacity * 100
    ) {
      // If total weight exceeds capacity, calculate the excess weight
      const excessWeight =
        existingVehicle.filledWeight +
        actualWeight -
        existingVehicle.maxCapacity * 100;

      // Adjust the total weight and filled weight accordingly
      totalWeight -= excessWeight;
      existingVehicle.filledWeight = existingVehicle.maxCapacity * 100;
    } else {
      // If total weight does not exceed capacity, update the filled weight
      existingVehicle.filledWeight += actualWeight;
    }

    // Update the existingBooking and existingVehicle accordingly
    existingBooking.allotedWeight = actualWeight;
    existingBooking.itemsList.totalWeight = actualWeight;

    existingVehicle.allotmentStatus = true;

    // Update the remaining logic to save the changes and respond


     existingVehicle.bookedBy.push({
       bookingId: existingBooking._id,
       vehicleType: existingVehicle.vehicleType,
       ownerDetails: {
         ownerName: existingVehicle.owner.name,
         ownerMobNo: existingVehicle.owner.phone,
       },
       materialDetails,
       recievableLiability,
       DriverDetails,
       arrangedBy: arrangedBy,
       netBhara: materialDetails.netBhara,
       commission: materialDetails.commission,
       balanceAmount:materialDetails.netBhara,
       driverBhara: materialDetails.driverBhara,
       quantity: materialDetails.quantity,
       quantityUnit: materialDetails.qtyUnit,
       rateAsPer: materialDetails.rateAsPer,
       rate:materialDetails.rate,
       billTo: billTo,
       ledgerBalanceParty: ledgerBalanceParty,
       remarks: materialDetails.remarks,
       date: Date.now(),
       status: "Initialized",
     });

  existingBooking.status = "Initialized";
  const data = {
    vehicleId: existingVehicle._id,
    DriverDetails,
    arrangedBy: arrangedBy,
    vehicleDriver:existingVehicle.driver.name,
    vehicleOwner:existingVehicle.owner.name,
    vehicleNo: existingVehicle.vehicleNo,
    vehicleDriverPhone: existingVehicle.driver.phone,
    vehicleOwnerPhone: existingVehicle.owner.phone,
    date: Date.now(),
  };

  // Check if arrangedByName is provided and add it to the data object
  if (arrangedByName) {
    data.arrangedBy = arrangedByName;
    data.arrangedByPhoneNo = arrangedByPhoneNo; // Corrected the syntax
  }

  existingBooking.allotedVehicle.push(data);

   
    // Save the changes to the database
    await Promise.all([existingBooking.save(), existingVehicle.save()]);

    return Response.json(
      { message: existingBooking },
      { success: true },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(req, res) {
  return Response.json({ msg: "This method is not allowed" }, { status: 400 });
}

export async function PUT(req, res) {
  return Response.json({ msg: "This method is not allowed" }, { status: 400 });
}
