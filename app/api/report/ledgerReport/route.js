import usermodel from "@/app/models/usermodel";
import bookingmodel from "@/app/models/bookingmodel";
import ledger from "@/app/models/accounting/ledgerModel";
import connectDB from "@/app/middleware/connectDB";

export async function POST(req, res) {
  try {
    await connectDB();
    const { startDate, ledgerId, vehicleNo, OrderNo, endDate } = await req.json();

    const ledgerData = await ledger.findOne({ _id: ledgerId });

    if (!ledgerData) {
      return Response.json({ message: "Ledger not found" }, { status: 404 });
    }

   const filteredEntries = ledgerData.booking.filter((entry) => {
     const entryDate = new Date(entry.savedBooking.date);
     const isWithinDateRange =
       entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
     const matchesVehicleNo = vehicleNo
       ? entry.savedBooking.allotedVehicle?.[
           entry.savedBooking.allotedVehicle.length - 1
         ]?.vehicleNo === vehicleNo
       : true;
     const matchesOrderNo = OrderNo
       ? entry.savedBooking.orderNumber === OrderNo
       : true;

     return isWithinDateRange && matchesVehicleNo && matchesOrderNo;
   });

    const response = filteredEntries.map((entry, index) => ({
      SlNo: index + 1,
      Date: entry.savedBooking.date,
      LRNo: entry.savedBooking.orderNumber,
      VehicleNo: vehicleNo,
      Particular: entry.savedBooking.materialInfo,
      Remarks: entry.savedBooking.remarks,
      DebitAmt: entry.savedBooking.totalBillingAmount,
      Balance: entry.balanceAmount,
    }));

    return Response.json({ data: response }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
