import user from "../../../../models/usermodel";
import Booking from "../../../../models/bookingmodel";
import Vehicle from "../../../../models/vehicleModel";
import connnectDB from "../../../../middleware/connectDB";
import { log } from "console";

export async function GET(req, context) {
  try {
    const { params } = context;
    const adminId = params.adminId;
    await connnectDB();

    const admin = user.findById(adminId);
    if (!admin) {
      return Response.json({ message: "admin not found" }, { status: 404 });
    }

    
    const monthlyData = [];

    // Calculate start and end dates for the current year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentYearStartDate = new Date(currentYear, 0, 1); 
      const currentYearEndDate = new Date(currentYear, 11, 31); 
      

  
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);

     
      const booking = await Booking.find({
        createdAt: { $gte: startDate, $lte: endDate },
      });
      const dvehicle = await Vehicle.find({
        createdAt: { $gte: startDate, $lte: endDate },
      });

      
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
        monthStartDate: startDate,
        monthEndDate: endDate,
      };

      // Update data based on the fetched data
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
      data.invoice = booking.filter((item) => item.status === "Pending").length;
      data.pendingInvoice = booking.filter(
        (item) => item.status === "Pending",
      ).length;

      booking.forEach((item) => {
        data.advanceAmount += item.advanceAmount;
        data.totalAmount += item.balanceAmount + item.advanceAmount;
      });

      data.advanceBooking = booking.filter(
        (item) => item.paymentTerm === "Advance",
      ).length;

      // Add the data for the current month to the monthlyData array
      monthlyData.push(data);
    }

    log(monthlyData);

    return Response.json({ monthlyData, adminId });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
