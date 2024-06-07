import usermodel from "@/app/models/usermodel";
import bookingmodel from "@/app/models/bookingmodel";
import vehicleModel from "@/app/models/vehicleModel";
import connectDB from "@/app/middleware/connectDB";

export async function POST(req, res) {
    try {
        const { fuelDetails, adminId, bookingId, vehicleId } = await req.json();

        console.log(fuelDetails, adminId, bookingId, vehicleId);

        await connectDB();
        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });

        if (!admin) return Response.json({ message: "admin not found" }, { status: 400 });

        const booking = await bookingmodel.findOne({ _id: bookingId });

        if (!booking) return Response.json({ message: "booking not found" }, { status: 400 });

        let vehicle = await vehicleModel.findOne({ _id: vehicleId });

        if (!vehicle) return Response.json({ message: "vehicle not found" }, { status: 400 });

        if (vehicle.expanse.fuel && vehicle.expanse.fuel.length > 0) {
            vehicle.expanse.fuel.push(fuelDetails);
        } else {
            vehicle.expanse.fuel = [fuelDetails];
        }

        const id = bookingId;
        let bookingUpdated = false;

        for (let i = 0; i < vehicle.bookedBy.length; i++) {

            if (vehicle.bookedBy[i].bookingId === id) {
                bookingUpdated = true;

                if (vehicle.bookedBy[i].fuelDetails && vehicle.bookedBy[i].fuelDetails.length > 0) {
                    vehicle.bookedBy[i].fuelDetails.push(fuelDetails);
                } else {
                    vehicle.bookedBy[i].fuelDetails = [fuelDetails];
                }

                vehicle.bookedBy[i].totalPaidAmount += fuelDetails?.cashReceived;
                vehicle.bookedBy[i].balanceAmount = vehicle.bookedBy[i].netBhara - vehicle.bookedBy[i].totalPaidAmount;

                const paymentData = {
                    date: fuelDetails.date,
                    paymentMode: "fuel",
                    amountPaid: fuelDetails?.cashReceived,
                    fine: 0,
                    finalDue: vehicle.bookedBy[i].balanceAmount,
                    paymentType: fuelDetails?.fuelType,
                    remarks: fuelDetails?.remarks,
                };

                if (vehicle.bookedBy[i].payment && vehicle.bookedBy[i].payment.length > 0) {
                    vehicle.bookedBy[i].payment.push(paymentData);
                } else {
                    vehicle.bookedBy[i].payment = [paymentData];
                }

                break;
            }
        }

        if (!bookingUpdated) {
            return Response.json({ message: "No matching booking found in vehicle.bookedBy" }, { status: 400 });
        }

        await vehicle.save();

        return Response.json({ message: "fuel details added successfully" });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}
