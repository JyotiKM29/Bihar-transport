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
      currentDate.getDate() - ((currentDate.getDay() + 6) % 7),
    );

    const currentWeekEndDate = new Date(
      currentWeekStartDate.getFullYear(),
      currentWeekStartDate.getMonth(),
      currentWeekStartDate.getDate() - 7,
    );

    console.log("Current Week Start Date:", currentWeekStartDate.toISOString());
    console.log("Current Week End Date:", currentWeekEndDate.toISOString());

    // Array to map the day number to its name
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Initialize objects to hold data for each metric
    const metrics = {
      totalOrder: [],
      pendingOrder: [],
      orderDispatched: [],
      lorryInCampus: [],
      inTransit: [],
      orderDelivered: [],
      pendingPOD: [],
      ewayWayBillExpiry: [],
      invoice: [],
      pendingInvoice: [],
      advanceAmount: [],
      totalAmount: [],
      advanceBooking: [],
    };

   
    let totalAmount = 0;
      let receivedAmount = 0;


    // Loop through the current week and the previous 5 weeks
    for (let i = 0; i < 7; i++) {
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
        totalOrder: booking.length,
        pendingOrder: booking.filter((item) => item.status === "Pending")
          .length,
        orderDispatched: booking.filter((item) => item.status === "Dispatched")
          .length,
        lorryInCampus: dvehicle.length,
        inTransit: booking.filter((item) => item.status === "In Transit")
          .length,
        orderDelivered: booking.filter((item) => item.status === "delevered")
          .length,
        pendingPOD: booking.filter((item) => item.status === "Pending").length,
        ewayWayBillExpiry: 0, // Add your logic to calculate this metric
        invoice: booking.filter((item) => item.status === "Pending").length,
        pendingInvoice: booking.filter((item) => item.invoiceStatus === false)
          .length,
        advanceAmount: 0, // Add your logic to calculate this metric
        totalAmount: 0, // Add your logic to calculate this metric
        advanceBooking: booking.filter((item) => item.paymentTerm === "Advance")
          .length,
      };

      // Push data to respective metric arrays
      Object.keys(data).forEach((key) => {
        metrics[key].push(data[key]);
      });
    
    // Log the metrics
    // console.log(metrics);
    console.log(metrics.totalOrder[5]);

    

     
   booking.forEach(bookingItem => {
    console.log("billling amount : ",bookingItem.totalBillingAmount);
    if(bookingItem.totalBillingAmount)
        totalAmount += bookingItem.totalBillingAmount;
    else totalAmount += bookingItem.partyBhara;

    
    if (bookingItem.paymentHistory && bookingItem.paymentHistory.paidAmount) {
      receivedAmount += bookingItem.paymentHistory.paidAmount;
    }

   });
  }

  let balanceAmount = totalAmount - receivedAmount;

  const amount ={
    balanceAmount,
    totalAmount,
    receivedAmount
  }



    return Response.json({ metrics, amount });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
