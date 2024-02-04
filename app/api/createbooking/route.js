import { User } from "lucide-react";
import connectDB from "../../middleware/connectDB";
import user from "../../models/usermodel";
import Booking from "../../models/bookingmodel";

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
      material,
      quantity,
      quantityUnit,
      vehicleType,
      actualWeight,
      chargedWeight,
      rateAsPer,
      rate,
      rateUnit,
      partyBhara,
      hideBhara,
      paymentLiability,
      billTo,
      paymentTerm,
      advanceAmount,
      balanceAmount,
      payMode,
      transactionId,
      remarks,
      additionalCharges,
      isUrgent,
      status,
    } = await req.json();

    const existingBooking = await Booking.findOne({ orderNumber });
    if (existingBooking) {
      return Response.json(
        { message: "Booking already exists" },
        { status: 400 },
      );
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
        material,
        quantity,
        quantityUnit,
        vehicleType,
        actualWeight,
        chargedWeight,
        rateAsPer,
        rate,
        rateUnit,
        partyBhara,
        hideBhara,
        paymentLiability,
        billTo,
        paymentTerm,
        advanceAmount,
        balanceAmount,
        payMode,
        transactionId,
        remarks,
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

      if (additionalCharges) {
        newBooking.additionalCharges = additionalCharges;
      }

      // Save the new booking
      const savedBooking = await newBooking.save();

      // console.log(updatedVehicle);
      console.log("Booking Created:", savedBooking);

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
        message: "Error adding booking ",
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
