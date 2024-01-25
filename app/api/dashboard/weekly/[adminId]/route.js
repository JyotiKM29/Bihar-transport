import user from "../../../../models/usermodel";
import Booking from "../../../../models/bookingmodel";
import Vehicle from "../../../../models/vehicleModel";
import Order from "../../../../models/orderModel";
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

      // Initialize an array to store data for each week
    const weeklyData = [];

    // Calculate start and end dates for the current week
    const currentDate = new Date();
    const currentWeekStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - (currentDate.getDay() + 6) % 7
      );
      
const currentWeekEndDate = new Date(
  currentWeekStartDate.getFullYear(),
  currentWeekStartDate.getMonth(),
  currentWeekStartDate.getDate() - 7
      );
      

      console.log("Current Week Start Date:", currentWeekStartDate.toISOString());
      console.log("Current Week End Date:", currentWeekEndDate.toISOString());
      

    // Loop through the current week and the previous 5 weeks
    for (let i = 0; i < 6; i++) {
      const startDate = new Date(
        currentWeekStartDate.getFullYear(),
        currentWeekStartDate.getMonth(),
        currentWeekStartDate.getDate() - 7 * i,
      );

      // Calculate end date for the current iteration
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 6,
      );

      // Fetch data for the current week
      const booking = await Booking.find({
        createdAt: { $gte: startDate, $lte: endDate },
      });
      const dvehicle = await Vehicle.find({
        createdAt: { $gte: startDate, $lte: endDate },
      });

      // Initialize data object for the current week
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
        weekStartDate: startDate,
        weekEndDate: endDate,
      };

      // Update data based on the fetched data
      data.totalOrder = booking.length;
      data.pendingOrder = booking.filter((item) => item.status === "Pending").length;
      data.orderDispatched = booking.filter((item) => item.status === "Dispatched").length;
      data.lorryInCampus = dvehicle.length;
      data.inTransit = booking.filter((item) => item.status === "In Transit").length;
      data.orderDelivered = booking.filter((item) => item.status === "delevered").length;
      data.pendingPOD = booking.filter((item) => item.status === "Pending").length;
      data.invoice = booking.filter((item) => item.status === "Pending").length;
      data.pendingInvoice = booking.filter((item) => item.status === "Pending").length;

      booking.forEach((item) => {
        data.advanceAmount += item.advanceAmount;
        data.totalAmount += item.balanceAmount + item.advanceAmount;
      });

      data.advanceBooking = booking.filter((item) => item.paymentTerm === "Advance").length;

      // Add the data for the current week to the weeklyData array
      weeklyData.push(data);
    }

    log(weeklyData);

    return Response.json({ weeklyData, adminId });
    // return Response.json({ data, adminId }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
