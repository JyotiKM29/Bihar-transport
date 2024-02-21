import Vehicle from "../../../models/vehicleModel";
import user from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";
import bulkPayment from "../../../models/accounting/bulkPayment";
import Booking from "../../../models/bookingmodel";

export async function POST(req, res) {
    
    try {

        const { adminId, date, vehicleNo, recieveFrom, recieveAmount, paymentMode, remarks } = await req.json();
        await connectDB();

        const admin = await user.findOne({
          $and: [
            { _id: adminId },
            { $or: [{ isAdmin: true }, { isOwner: true }] },
          ],
        });
      
       console.log(admin);
        if (!admin) {
            return Response.json({ message: "Admin not found." }, { status: 404 });
        }

        const vehicle = await Vehicle.findOne({ vehicleNo });

        if (!vehicle) {
            return Response.json({ message: "Vehicle not found." }, { status: 404 });
        }

       
        let payment = recieveAmount;
        let numOfBookings = vehicle.booking ? vehicle.booking.length : 0;
        let i = 0;
     
        while (payment > 0 && i < numOfBookings) {
             if (!vehicle.remainingAmount) {
               vehicle.remainingAmount = vehicle.booking[i].netBhara;
             }
          if (payment >= vehicle.booking[i].remainingAmount) {
            payment -= vehicle.booking[i].remainingAmount;
            vehicle.booking[i].netBhara = 0;
            vehicle.booking[i].isPaid = true;

            await Booking.findOneAndUpdate(
              { _id: vehicle.booking[i].bookingId },
              { $set: { netBhara: 0, paymentTerm: "Paid" } },
              { new: true },
            );
          } else {
            vehicle.booking[i].netBhara -= payment;
            await Booking.findOneAndUpdate(
              { _id: vehicle.booking[i].bookingId },
              {
                $set: {
                  netBhara: vehicle.booking[i].netBhara,
                  paymentTerm: "Partially Paid",
                },
              },
              { new: true },
            );
            payment = 0;
          }
          i++;
        }

        if (!vehicle.payment) vehicle.payment = [];
        vehicle.payment.push({
          date,
          recieveFrom,
          recieveAmount,
          paymentMode,
          remarks,
          createdBy: {
            name: admin.name,
            adminId: admin._id,
            date: new Date(),
          },
        });

        await vehicle.save();

        const slip = new bulkPayment({
          date,
          recieveFrom,
          recieveAmount,
          paymentMode,
          remarks,
          createdBy: {
            name: admin.name,
            adminId: admin._id,
            date: Date.now(),
          },
        });

     const data = await slip.save();
      console.log("worked", data);
        return Response.json({ message: "Payment received successfully." }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message, }, { status: 500 });
    }

}