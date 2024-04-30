import { User } from "lucide-react";
import connectDB from "../../middleware/connectDB";
import user from "../../models/usermodel";
import Booking from "../../models/bookingmodel";
import ledger from "../../models/accounting/ledgerModel";

export async function POST(req, res) {
  try {
    await connectDB();

    const {
      adminId,
      orderNumber,
      date,
      vehicleRequiredDate,
      bookingType,
      consignorName,
      consignorMobileNumber,
      loadingPoints,
      consigneeName,
      consigneeMobileNumber,
      unloadingPoints,
      way,
      noOfVehicle,
      customNoOfVehicle,
      partyBhara,
      hideBhara,
      paymentLiability,
      billTo,
      paymentTerm,
      totalBillingAmount,
      totalAdditionalCharges,
      totalAdditionalChargeTax,
      payMode,
      transactionId,
      remarks,
      additionalCharges,
      isUrgent,
      status,
      itemsList,
      vehicleType,
    } = await req.json();

    const existingBooking = await Booking.findOne({ orderNumber });
    if (existingBooking) {
      return Response.json(
        { message: "Booking already exists" },
        { status: 400 },
      );
    }

    function calculateTotalActualWeight(itemsList) {
  let totalActualWeight = 0;
  itemsList.forEach(item => {
    totalActualWeight += item.actualWeight || 0;
  });
  return totalActualWeight;
}

// Define a function to calculate the total amount
function calculateTotalAmount(itemsList) {
  let totalAmount = 0;
  itemsList.forEach(item => {
    totalAmount += item.amount || 0;
  });
  return totalAmount;
}

    const admin = await user.findOne({ _id: adminId });
    if (admin && (admin.isAdmin || admin.isOwner)) {
   

      // Create a new booking
      const newBooking = new Booking({
        orderNumber,
        date,
        vehicleRequiredDate,
        bookingType,
        consignorName,
        consignorMobileNumber,
        loadingPoints,
        consigneeName,
        consigneeMobileNumber,
        unloadingPoints,
        way,
        noOfVehicle: noOfVehicle === "others" ? customNoOfVehicle : noOfVehicle,
        itemsList: {
          item: itemsList,
          totalActualWeight: calculateTotalActualWeight(itemsList),
          totalAmount: calculateTotalAmount(itemsList),
        },
        vehicleType,
        partyBhara,
        hideBhara,
        paymentLiability,
        billTo,
        paymentTerm,
        // advanceAmount,
        totalBillingAmount,
        totalAdditionalCharges,
        totalAdditionalChargeTax,
        payMode,
        transactionId,
        remarks,
        additionalCharges,
        createdBy: {
          name: admin.name,
          adminId,
        },
      });

      if (status === "Confirmed") {
        newBooking.status = "Confirmed";
      }

      if (isUrgent) {
        newBooking.isUrgent = true;
      }

      // if (additionalCharges) {
      //   newBooking.additionalCharges = additionalCharges;
      //   console.log("Additional Charges:", additionalCharges);
      // }

      // Save the new booking
       const savedBooking = await newBooking.save();
      console.log(savedBooking);
      
      const update = await ledger.findOne({ "basicInfo.contactNo": consignorMobileNumber });
      console.log(update);
      if (update) {

        update.totalAmount += totalBillingAmount;
        // if (update.advanceAmount) update.advanceAmount += advanceAmount;
        // else update.advanceAmount = advanceAmount;
        
       if(!update.booking )
          update.booking = [];
          update.booking.push({
            savedBooking,
          });
        
        
        console.log("Ledger Updated:", update);
      }
      
      // console.log("not saved till now")
         await update.save();
        console.log("saved")
       


      // // console.log(updatedVehicle);
      // console.log("Booking Created:", savedBooking);

      return Response.json(
        {
          message: "Booking successful",
          Booking: savedBooking,
        },
        { status: 200 },
      );
    } else {
      return Response.json(
        { message: "admin does not exist" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error while Booking to the database:", error.message);

    return Response.json(
      {
        message: error.message,
        error: error.message,
      },
      { status: 404 },
    );
  }
}

export async function GET(req, res) {
  return Response.json(
    {
      message: "Method Not Allowed",
    },
    { status: 405 },
  );
}
