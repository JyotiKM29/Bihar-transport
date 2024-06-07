import usermodel from "@/app/models/usermodel";
import bookingmodel from "@/app/models/bookingmodel";
import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";


export async function POST(req, res) {
    
    try {
        
        const { fuelDetails, adminId, bookingId, vehicleId } = await req.json();
        /*

        const fuelDetails = {
      bookingId:data._id,
      vehicleId: data.vehicleData._id,
      fuelType,
      date,
      slipCouponNo,
      petrolPump,
      fuelVolume,
      fuelRate,
      cashReceived,
      paymentTerm,
      remarks,
    };


        */
        
        console.log(fuelDetails, adminId, bookingId, vehicleId);
        await connectDB();
        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });

        if (!admin) return Response.json({ message: "admin not found" }, { status: 400 });

        // find the booking

        const booking = await bookingmodel.findOne({ _id: bookingId });

        if (!booking) return Response.json({ message: "booking not found" }, { status: 400 });

        const vehicle = await vehicleModel.findOne({ _id: vehicleId });

        if (!vehicle) return Response.json({ message: "vehicle not found" }, { status: 400 });

        data = {
            bookingId,
            fuelType,
            date,
            slipNo: slipCouponNo,
            petrolPump,
            fuelVolume,
            fuelRate,
            cashReceived,
            paymentTerm,
            remarks,
        
        };

        if (vehicle.expanse.fuel && vehicle.expanse.fuel.length > 0) {
            vehicle.expanse.fuel.push(data);

        }
        else {
            vehicle.expanse.fuel = [data];
        }

        vehicle.bookedBy.forEach((item) => {

            if(item.bookingId === bookingId){
                if (item.fuelDetails && item.fuelDetails.length > 0)
                    item.fuelDetails.push(data);
                else item.fuelDetails = [data];

                item.totalPaidAmount += cashReceived;
                item.balanceAmount = item.totalAmount - item.totalPaidAmount;
                const paymentData = {
                    date: date,
                    paymentMode: "fuel",
                    amountPaid: cashReceived,
                    fine: 0,
                    finalDue: item.balanceAmount,
                    paymentType: fuelType,
                    remarks: remarks,
                }

                item.payment && item.payment.length > 0 ? item.payment.push(paymentData) : item.payment = [paymentData];
            }
        });

        
        await vehicle.save();
                
       
        return Response.json({ message: "fuel details added successfully" });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }




}