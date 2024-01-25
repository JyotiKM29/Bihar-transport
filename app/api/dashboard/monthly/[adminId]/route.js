import user from "../../../../models/usermodel";
import Booking from "../../../../models/bookingmodel";
import Vehicle from "../../../../models/vehicleModel";
import Order from "../../../../models/orderModel";
import connnectDB from "../../../../middleware/connectDB";
import { log } from "console";


export async function GET(req,context){

    try {
        
      const { params } = context;
        const adminId = params.adminId;
        await connnectDB();

      const admin = user.findById(adminId);
      if (!admin) {
        return Response.json({ message: "admin not found" }, { status: 404 });
      }

    const data = {
      totalOrder: 0,
      pendingOrder: 0,
      orderDispatched: 0,
      lorryInCampus: 0,
      inTransit: 0,
      orderDelivered: 0,
      pendingPOD: 0,
      ewayWayBillExpiry: 0,
      invoice: 0,
      pendingInvoice: 0,
      advanceAmount: 0,
      totalAmount: 0,
      advanceBooking: 0,
    };

        log(data);
        const booking = await Booking.find();
        const dvehicle = await Vehicle.find();
        log(booking.length);

        data.totalOrder = booking.length;
       
      data.pendingOrder = booking.filter(
        (item) => item.status === "Pending",
      ).length;
        
        data.orderDispatched = booking.filter(
          (item) => item.status === "Dispatched",
        ).length;
        data.lorryInCampus = dvehicle.length;
        data.inTransit = booking.filter(
          (item) => item.status === "In Transit",
        ).length;
        data.orderDelivered = booking.filter(
          (item) => item.status === "delevered",
        ).length;
        data.pendingPOD = booking.filter(
          (item) => item.status === "Pending",
        ).length;
        data.invoice = booking.filter(
          (item) => item.status === "Pending",
        ).length;
        data.pendingInvoice = booking.filter(
          (item) => item.status === "Pending",
        ).length;
        
        booking.forEach((item) => {
            data.advanceAmount += item.advanceAmount;
            data.totalAmount += (item.balanceAmount + item.advanceAmount);
        }
        );

        data.advanceBooking = booking.filter( (item) => item.paymentTerm === "Advance").length;
log(data);

      return Response.json({ data, adminId }, { status: 200 });
    }catch(error){
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });

    }
  
}