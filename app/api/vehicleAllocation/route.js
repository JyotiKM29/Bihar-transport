import vehicle from "../../models/vehicleModel";
import Booking from "../../models/bookingmodel";
import Order from "../../models/orderModel";
import connectDB from "../../middleware/connectDB";
import user from "../../models/usermodel";


export async function POST(req, res) {

    try {
        await connectDB();
        const { bookingId, vehicleId, adminId } = await req.json();

        const admin = await user.findById(adminId);
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }

        const existingVehicle = await vehicle.findById(vehicleId);

        if (!existingVehicle) {
            return Response.json({ message: "Vehicle not found" }, { status: 404 });
        }
        const existingBooking = await Booking.findById(bookingId);

        if (!existingBooking) {
            return Response.json({ message: "Booking not found" }, { status: 404 });
        }

        if (existingBooking.status !== "Pending") { 
            console.log(existingBooking.status);
            return Response.json(
              { message: "Booking is not in pending state" },
              { status: 400 },
            );
        }

        if (existingBooking.allotedVehicle.length > 0) {
            
            return Response.json({ message: "Booking is already alloted" }, { status: 400 });
        };



        if (existingBooking.vehicleRequiredDate < Date.now()) {
            return Response.json(
              { message: "Booking is already expired" },
              { status: 400 },
            );
        }

        // within 24 hrs

        if (existingBooking.vehicleRequiredDate < Date.now() + 86400000) {
            return Response.json({ message: "Booking should be urgent" }, { status: 400 });
        } 

        const newOrder = new Order({
          booking: {
            id: bookingId,
            date: existingBooking.vehicleRequiredDate,
            client: {
              name: existingBooking.consignorName,
              phone: existingBooking.consigneeMobileNumber,
            },
            loadingPoints: existingBooking.loadingPoints,
            unloadingPoints: existingBooking.unloadingPoints,
          },
          vehicle: {
            id: vehicleId,
            number: existingVehicle.vehicleNo,
            driver: {
              name: existingVehicle.driver.name,
              phone: existingVehicle.driver.phone,
            },
            owner: {
              name: existingVehicle.owner.name,
              phone: existingVehicle.owner.phone,
            },
          },
          payment: {
            mode: existingBooking.payMode,
            amount:
              existingBooking.advanceAmount + existingBooking.balanceAmount,
            advance: existingBooking.advanceAmount,
            balance: existingBooking.balanceAmount,
          },
          status: "Initialized",
          createdBY: {
            id: adminId,
            name: admin.name,
            date: Date.now(),
          },
        });

        if (existingBooking.isUrgent) {
      
            newOrder.isUrgent = true;
        }
        

        existingVehicle.allotmentStatus = true;

        existingVehicle.bookedBy.push({
          bookingID: bookingId,
          bookingOwner: existingBooking.consignorName,
          date: Date.now(),
        });

        existingBooking.status = "Initialized";
        existingBooking.allotedVehicle.push({
          vehicleId: vehicleId,
            vehicleOwner: existingVehicle.owner.name,
            vehicleDriver: existingVehicle.driver.name,
            vehicleNo: existingVehicle.vehicleNo,
            vehicleDriverPhone: existingVehicle.driver.phone,
            vehicleOwnerPhone: existingVehicle.owner.phone,
          date: Date.now(),
        });
        await existingVehicle.save();
        await existingBooking.save();
        const savedOrder = await newOrder.save();

        return Response.json({ savedOrder }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json(
          { message: error.message },
          { status: 400 },
        );
    }
    


}

export async function GET(req, res) {
  return Response.json({ msg: "This method is not allowed" }, { status: 400 });
}


export async function PUT(req,res) {
  return Response.json({ msg: "This method is not allowed" }, {status:400});
}
