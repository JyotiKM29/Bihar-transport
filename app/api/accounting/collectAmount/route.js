import connectDB from "../../../middleware/connectDB";
import user from "../../../models/usermodel";
import Booking from "../../../models/bookingmodel";
// import { date } from "zod";


export async function POST(req, res) {
    
    try {
     
        await connectDB();
        const { adminId, _id, paidAmount, paymentDate, paymentMode, TDS } = await req.json();
        const admin = await user.findOne({
            $and: [{ _id: adminId },
            { $or: [{isAdmin: true }, { isOwner: true }]
        }]
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }

        const booking = await Booking.findOne({ _id });
        if (!booking) {
            return Response.json({ message: "Booking not found" }, { status: 404 });
        }

        if(booking.balanceAmount < paidAmount){
            return Response.json({ message: "Paid amount is greater than balance amount" }, { status: 400 });
        }
        const date = paymentDate? paymentDate : new Date();

        if(!booking.paidAmount){
            booking.totalPaidAmount = paidAmount;
        }
        else 
          booking.totalPaidAmount += paidAmount;

        booking.balanceAmount -= paidAmount;
        const newPayment= {
            bookingId: _id,
            paidAmount,
            paymentDate: date,
            paymentMode,
            TDS,
        };

        if (booking.paymentHistory) {
            booking.paymentHistory.push(newPayment);
        } else {
            booking.paymentHistory = [];
            booking.paymentHistory.push(newPayment);
        }

        if (booking.balanceAmount === 0) {
            booking.paymentTerm = 'Paid';
        }

        const updated = {
            name: admin.name,
            adminId,
            date: new Date(),
        };
          if(booking.updatedBy)
              booking.updatedBy.push(updated);

        else{
          booking.updatedBy = [];
          booking.updatedBy.push(updated);
        }

        const final = await booking.save();
        return Response.json({ message: "Payment collected successfully", final }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }
}