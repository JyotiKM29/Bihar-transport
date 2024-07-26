import vehicle from "../../models/vehicleModel";
import Booking from "../../models/bookingmodel";
import Order from "../../models/orderModel";
import connectDB from "../../middleware/connectDB";
import user from "../../models/usermodel";
import ledger from "../../models/accounting/ledgerModel";

function generateUniqueId() {
  const value = Math.floor(100000 + Math.random() * 900000);
  return "BT" + value;
}

async function createUniqueOrderNumber() {
  let orderNo;
  let existingOrder;
  do {
    orderNo = generateUniqueId();
    existingOrder = await Booking.findOne({ orderNumber: orderNo });
  } while (existingOrder);
  return orderNo;
}

async function updateLedger(consignorMobileNumber, totalBillingAmount) {
  const update = await ledger.findOne({ "basicInfo.contactNo": consignorMobileNumber });
  if (update) {
    update.totalAmount += totalBillingAmount;
    if (!update.booking) {
      update.booking = [];
    }
    update.booking.push({
      totalBillingAmount,
    });
    await update.save();
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const {
      orderNo,
      vehicleNo,
      adminId,
      ledgerBalance,
      paymentLiability,
      ledgerBalanceParty,
      remarks,
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
      return Response.json({ message: "Admin not found" }, { status: 400 });
    }

    const existingVehicle = await vehicle.findOne({ vehicleNo });
    if (!existingVehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 400 });
    }

    const existingBooking = await Booking.findOne({ orderNumber: orderNo });
    if (!existingBooking) {
      return Response.json({ message: "Booking not found" }, { status: 400 });
    }

    if (existingBooking.status === "Initialized") {
      return Response.json({ message: "Booking is already initialized" }, { status: 400 });
    }

    if (existingBooking.status === "Pending") {
      existingBooking.status = "Confirmed";
    }

    if (existingBooking.status !== "Confirmed") {
      return Response.json({ message: "Booking is not confirmed" }, { status: 400 });
    }

    if (existingBooking.allotedVehicle.length > 0) {
      return Response.json({ message: "Booking is already allotted" }, { status: 400 });
    }

    const newWeight = existingBooking.itemsList.totalActualWeight;

    // Create a copy of the existing booking
    const bookingCopy = { ...existingBooking.toObject(), _id: undefined };
    const actualWeight = materialDetails.actualWgt;
    let remainingWeight = actualWeight;

    // Adjust the copied booking's item weights to reflect the remaining weights
    for (let item of bookingCopy.itemsList.item) {
      if (item.actualWeightUnit === "TON") {
        const reduction = Math.min(item.actualWeight * 1000, remainingWeight);
        item.actualWeight -= reduction / 1000;
        remainingWeight -= reduction;
        if (item.actualWeight * 1000 === 0) {
          item.actualWeight = 0; // Set to 0 to match the requirement
        }
      } else {
        const reduction = Math.min(item.actualWeight, remainingWeight);
        item.actualWeight -= reduction;
        remainingWeight -= reduction;
        if (item.actualWeight === 0) {
          item.actualWeight = 0; // Set to 0 to match the requirement
        }
      }
    }

    // Adjust the original booking's item weights to match the actualWeight
    remainingWeight = actualWeight;
    for (let item of existingBooking.itemsList.item) {
      if (remainingWeight <= 0) break;
      if (item.actualWeightUnit === "TON") {
        const reduction = Math.min(item.actualWeight * 1000, remainingWeight);
        item.actualWeight = reduction / 1000; // Set the actual weight to reduction
        remainingWeight -= reduction;
      } else {
        const reduction = Math.min(item.actualWeight, remainingWeight);
        item.actualWeight = reduction; // Set the actual weight to reduction
        remainingWeight -= reduction;
      }
    }

    bookingCopy.status = "Pending";
    bookingCopy.orderNumber = await createUniqueOrderNumber();

    // Remove items with 0 weight from the copied booking
    bookingCopy.itemsList.item = bookingCopy.itemsList.item.filter(item => item.actualWeight > 0);
    bookingCopy.itemsList.totalActualWeight = newWeight;

    // Set the allotment data in the original booking
    existingBooking.allotedWeight = actualWeight;
    existingBooking.itemsList.totalActualWeight = actualWeight;
    existingVehicle.allotmentStatus = true;

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
      arrangedBy,
      netBhara: materialDetails.netBhara,
      commission: materialDetails.commission,
      balanceAmount: materialDetails.netBhara,
      driverBhara: materialDetails.driverBhara,
      quantity: materialDetails.quantity,
      quantityUnit: materialDetails.qtyUnit,
      rateAsPer: materialDetails.rateAsPer,
      rate: materialDetails.rate,
      billTo,
      ledgerBalanceParty,
      remarks: materialDetails.remarks,
      date: Date.now(),
      status: "Initialized",
    });

    existingBooking.status = "Initialized";
    existingBooking.allotedVehicle.push({
      vehicleId: existingVehicle._id,
      DriverDetails,
      arrangedBy,
      vehicleDriver: existingVehicle.driver.name,
      vehicleOwner: existingVehicle.owner.name,
      vehicleNo,
      vehicleDriverPhone: existingVehicle.driver.phone,
      vehicleOwnerPhone: existingVehicle.owner.phone,
      date: Date.now(),
      arrangedBy: arrangedByName,
      arrangedByPhoneNo,
    });

    // Save the updated and new booking
    await Promise.all([existingBooking.save(), existingVehicle.save()]);
    const newBooking = new Booking(bookingCopy);

    console.log("new booking ", newBooking);
    await newBooking.save();

    // Update the ledger
    await updateLedger(existingBooking.consignorMobileNumber, existingBooking.totalBillingAmount);

    return Response.json({ message: "Booking successfully allocated", Booking: existingBooking }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(req) {
  return Response.json({ msg: "This method is not allowed" }, { status: 405 });
}

export async function PUT(req) {
  return Response.json({ msg: "This method is not allowed" }, { status: 405 });
}
