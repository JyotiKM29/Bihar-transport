import connectDB from "../../../../middleware/connectDB";
import ledger from "../../../../models/accounting/ledgerModel"; 
import Booking from "../../../../models/bookingmodel";
import { log } from 'console';



export async function GET(req, context) {
    

    try {
                const { params } = context;
      const orderNo = params.orderNo;
      
      log(orderNo)


        await connectDB();

        const booking = await Booking.findOne(
          { orderNumber: orderNo },
          { consignorMobileNumber: 1, _id:0 },
        );

        log(booking);

        if (!booking) {
            return Response.json({ message: "Booking does not exist" }, { status: 400 });
        }

        const ledgerData = await ledger.findOne({
          "basicInfo.contactNo": booking.consignorMobileNumber,
        });

        const balance = ledgerData.totalAmount - ledgerData.advanceAmount;

        return Response.json({ balance }, { status: 200 });

        







    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }






}