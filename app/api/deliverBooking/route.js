// pages/api/delivery.js
import User from "../../models/usermodel";
import Booking from "../../models/bookingmodel";
import { NextResponse } from "next/server";
import connectDB from "../../middleware/connectDB";

export async function POST(req) {
    try {
        const {
            adminId,
            bookingId,
            deliveryDetails,
            paymentDetails,
            consignmentInfo,
        } = await req.json();

        console.log("yes");

        await connectDB();

        // Validate admin
        const admin = await User.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        
        if (!admin) {
            return Response.json({ message: "admin not found" }, { status: 400 });

        }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 },
      );
    }

    // Create or update delivery details
   if(booking.status === "Delivered") {

    // send an response that it is already delievered
    return NextResponse.json({ message: "Booking is already delivered" }, { status: 400 });

        }
        
        if (booking.status !== "In Transit") {
            
            return NextResponse.json({ message: `Booking is ${booking.status} but we need In Transit to proceed` }, { status: 400 });
        }

        if(!deliveryDetails || !paymentDetails || !consignmentInfo){

            return Response.json({ message: "Data is not filled properly" }, { status: 400 });


        }




          booking.delivery.delivery_details = deliveryDetails;
    booking.delivery.payment_details = paymentDetails;
            booking.delivery.consignment_info = consignmentInfo;
            booking.status = "Delivered";
        
            booking.pyamentHistory.push({
                paymentDetails,
                date: new Date(),
            });
        
        // updated that much paid amount
        booking.totalPaidAmount += paymentDetails.amount_received;

        if (booking.totalPaidAmount === booking.totalBillingAmount) {
            booking.paymentTerm = "Paid";
        }

        // now may be we need to update the payment details

        booking.updatedBy.push({
            name: admin.name,
            adminId: admin._id,
            date: new Date(),
        });




    await booking.save();

    return NextResponse.json(
      { message: "Delivery details saved successfully", booking },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export default function handler(req, res) {
  if (req.method === "POST") {
    return POST(req, res);
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }
}
