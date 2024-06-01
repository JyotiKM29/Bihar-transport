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
      
      //  console.log(admin);
        if (!admin) {
            return Response.json({ message: "Admin not found." }, { status: 404 });
        }

        const vehicle = await Vehicle.findOne({ vehicleNo });

        if (!vehicle) {
            return Response.json({ message: "Vehicle not found." }, { status: 404 });
        }

       
        let payment = recieveAmount;
        let numOfBookings = vehicle.bookedBy ? vehicle.bookedBy.length : 0;
        console.log("no of booking", numOfBookings);
        let i = 0;

        console.log("booking which are allocated to this vehicle: ", vehicle.bookedBy);
     
        while (payment > 0 && i < numOfBookings) {

          
          if (!vehicle.remainingAmount) {
            vehicle.remainingAmount = vehicle.bookedBy[i].netBhara;
          }
          
          if(!vehicle.bookedBy[i].balanceAmount){
            vehicle.bookedBy[i].balanceAmount = vehicle.bookedBy[i].netBhara;
          }
          // balanceAmount
          console.log("blance amount before : ", vehicle.bookedBy[i].balanceAmount);


          if (payment >= vehicle.bookedBy[i].balanceAmount) {
            payment -= vehicle.bookedBy[i].balanceAmount;
            vehicle.bookedBy[i].balanceAmount = 0;
            vehicle.bookedBy[i].isPaid = true;

           
          } else {
            vehicle.bookedBy[i].balanceAmount -= payment;
            payment = 0;
          }

                    console.log("blance amount after : ", vehicle.bookedBy[i].balanceAmount);



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
          vehicleId:vehicle._id,
          recieveAmount,
          paymentMode,
          remarks,
          createdBy: {
            name: admin.name,
            adminId: admin._id,
            date: Date.now(),
          },
        });

     console.log("slip", slip);

    console.log("booking which are allocated to this vehicle: ", vehicle.bookedBy);


     const data = await slip.save();
      console.log("worked", data);
        return Response.json({ message: "Payment received successfully." }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message, }, { status: 500 });
    }

}