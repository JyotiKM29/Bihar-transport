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

export async function POST(req, res) {
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
      return res.status(404).json({ message: "Admin not found" });
    }

    const existingVehicle = await vehicle.findOne({ vehicleNo });
    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const existingBooking = await Booking.findOne({ orderNumber: orderNo });
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (existingBooking.status === "Initialized") {
      return res.status(400).json({ message: "Booking is already initialized" });
    }

    if (existingBooking.status === "Pending") {
      existingBooking.status = "Confirmed";
    }

    if (existingBooking.status !== "Confirmed") {
      console.log(existingBooking.status);
      return res.status(400).json({ message: "Booking is not confirmed" });
    }

    if (existingBooking.allotedVehicle.length > 0) {
      return res.status(400).json({ message: "Booking is already allotted" });
    }

    // Create a copy of the existing booking
    const bookingCopy = { ...existingBooking.toObject() };
    const actualWeight = materialDetails.actualWgt;
    let remainingWeight = actualWeight;

    // Adjust the actual weight of items in the original booking using a greedy method
    for (let item of existingBooking.itemsList.item) {
      if (remainingWeight <= 0) break;
      const reduction = Math.min(item.actualWeight, remainingWeight);
      item.actualWeight -= reduction;
      remainingWeight -= reduction;
    }

    // Adjust the copied booking's item weights
    remainingWeight = actualWeight;
    for (let item of bookingCopy.itemsList.item) {
      if (remainingWeight <= 0) break;
      const reduction = Math.min(item.actualWeight, remainingWeight);
      item.actualWeight -= reduction;
      remainingWeight -= reduction;
    }

    bookingCopy.status = "Pending";
    bookingCopy.orderNumber = await createUniqueOrderNumber();

    // Set the allotment data in the original booking
    existingBooking.allotedWeight = actualWeight;
    existingBooking.itemsList.totalWeight = actualWeight;
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
    await newBooking.save();

    // Update the ledger
    await updateLedger(existingBooking.consignorMobileNumber, existingBooking.totalBillingAmount);

    return res.status(200).json({ message: "Booking successfully allocated", Booking: existingBooking });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function GET(req, res) {
  return res.status(405).json({ msg: "This method is not allowed" });
}

export async function PUT(req, res) {
  return res.status(405).json({ msg: "This method is not allowed" });
}
