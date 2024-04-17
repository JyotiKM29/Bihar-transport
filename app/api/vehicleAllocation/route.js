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
      arrangedBy,
      transporterDetails,
      ledgerBalance,
      rateAsPer,
      rate,
      driverBhara,
      commission,
      netBhara,
      paymentLiability,
      billTo,
      ledgerBalanceParty,
      remarks,
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
      return Response.json({ message: "Booking is already initialized" }, { status: 400 })
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

    // removing the date check

    // if (existingBooking.vehicleRequiredDate < Date.now()) {
    //   return Response.json(
    //     { message: "Booking is already expired" },
    //     { status: 400 },
    //   );
    // }

    // // within 24 hrs
    // if (existingBooking.vehicleRequiredDate < Date.now() + 86400000) {
    //   return Response.json(
    //     { message: "Booking should be urgent" },
    //     { status: 400 },
    //   );
    // }

    console.log(existingBooking.itemsList);

    let totalWeight = 0;
    existingBooking.itemsList?.forEach((item) => {
      if (item.actualWeightUnit === "KG") totalWeight += item.actualWeight;

      if (item.actualWeightUnit === "quintal")
        totalWeight += item.actualWeight * 100;

      if (item.actualWeightUnit === "ton")
        totalWeight += item.actualWeight * 1000;
    });

    // const newOrder = new Order({
    //   booking: {
    //     id: existingBooking._id,
    //     date: existingBooking.vehicleRequiredDate,
    //     client: {
    //       name: existingBooking.consignorName,
    //       phone: existingBooking.consigneeMobileNumber,
    //     },
    //     loadingPoints: existingBooking.loadingPoints,
    //     unloadingPoints: existingBooking.unloadingPoints,
    //     totalWeight,
    //     totalWeightUnit:"KG"
    //   },
    //   vehicle: {
    //     id: existingVehicle._id,
    //     number: existingVehicle.vehicleNo,
    //     driver: {
    //       name: existingVehicle.driver.name,
    //       phone: existingVehicle.driver.phone,
    //     },
    //     owner: {
    //       name: existingVehicle.owner.name,
    //       phone: existingVehicle.owner.phone,
    //     },
    //   },
    //   payment: {
    //     mode: existingBooking.payMode,
    //     amount: existingBooking.advanceAmount + existingBooking.balanceAmount,
    //     advance: existingBooking.advanceAmount,
    //     balance: existingBooking.balanceAmount,
    //   },
    //   status: "Initialized",
    //   createdBY: {
    //     id: adminId,
    //     name: admin.name,
    //     date: Date.now(),
    //   },
    // });

    // if (existingBooking.isUrgent) {
    //   newOrder.isUrgent = true;
    // }

    existingVehicle.allotmentStatus = true;

    // reducing the capacity of the

    // worst case

    if (
      existingVehicle.filledWeight + totalWeight >
      existingVehicle.maxCapacity * 100
    ) {
      // total weight is greater than the capacity

      // how much weight is left for booking
      let weight =
        existingVehicle.filledWeight +
        totalWeight -
        existingVehicle.maxCapacity * 100;
      existingVehicle.filledWeight = existingVehicle.maxCapacity * 100;

      if (!existingBooking.allotedWeight) existingBooking.allotedWeight = 0;
      existingBooking.allotedWeight += totalWeight - weight;

      // check if not total weight in item list
      if (!existingBooking.itemsList.totalWeight)
        existingBooking.itemsList.totalWeight = 0;

      existingBooking.itemsList.totalWeight = totalWeight;
    }

    // best case

    if (
      existingVehicle.filledWeight + totalWeight <=
      existingVehicle.maxCapacity * 100
    ) {
      // add the weight to vehicle

      existingVehicle.filledWeight += totalWeight;

      if (!existingBooking.allotedWeight) existingBooking.allotedWeight = 0;

      existingBooking.allotedWeight = totalWeight;
      existingBooking.itemsList.totalWeight = totalWeight;
    }

    existingVehicle.filledWeight =
      existingVehicle.maxCapacity * 100 - totalWeight;

    existingVehicle.bookedBy.push({
      bookingId: existingBooking._id,
      vehicleType: existingVehicle.vehicleType,
      ownerDetails: {
        ownerName: existingVehicle.owner.name,
        ownerMobNo: existingVehicle.owner.phone,
      },
      weight: totalWeight,
      arrangedBy: arrangedBy,
      transporterDetails: transporterDetails,
      ledgerBalance: ledgerBalance,
      rateAsPer: rateAsPer,
      rate: rate,
      driverBhara: driverBhara,
      commission: commission,
      netBhara: netBhara,
      paymentLiability: paymentLiability,
      billTo: billTo,
      ledgerBalanceParty: ledgerBalanceParty,
      remarks: remarks,
      date: Date.now(),
      status: "Initialized",
    });

    existingBooking.status = "Initialized";
    existingBooking.allotedVehicle.push({
      vehicleId: existingVehicle._id,
      vehicleOwner: existingVehicle.owner.name,
      vehicleDriver: existingVehicle.driver.name,
      vehicleNo: existingVehicle.vehicleNo,
      vehicleDriverPhone: existingVehicle.driver.phone,
      vehicleOwnerPhone: existingVehicle.owner.phone,
      date: Date.now(),
    });

    await Promise.all([existingBooking.save(), existingVehicle.save()]);

    // await existingVehicle.save();
    // await existingBooking.save();
    // const savedOrder = await newOrder.save();

    return Response.json(
      { message: existingBooking },
      { sucess: true },
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
