import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import Booking from "../../models/bookingmodel";
import order from "../../models/orderModel";

export async function POST(req, res) {
    
    try {
        
        await connectDB();
        const { adminId, bookingId,status } = await req.json();
        console.log(adminId, bookingId, status);

        const admin = await user.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
      }
      
      if (status === "Cancelled") {
        return Response.json({ message: "Invalid request" }, { status: 400 });
      }

        const booking = await Booking.findOne({ _id: bookingId });
        console.log(booking);
        const exitingOrder = await order.findOne({ "booking.id": booking.orderId });
        console.log(exitingOrder);
        if(!booking){
            return Response.json({ message: "Booking not found" }, { status: 404 });
        }
        if(booking.status === "confirmed"){
            return Response.json({ message: "Booking already confirmed" }, { status: 400 });
        }

        if (booking.status == 'Pending' && status === 'Confirmed') {
            booking.status = status;
            booking.updatedBy.push({ name: admin.name, adminId: adminId, date: Date.now() });
            await booking.save();
           
            if (exitingOrder) {
                exitingOrder.status = status;
                exitingOrder.updatedBy.push({ name: admin.name, id: adminId, date: Date.now() });
                await exitingOrder.save();
            }

            return Response.json({ message: `Booking ${status}` }, { status: 200 });
        }

       else if (booking.status == 'Pending' && status === 'Cancelled') {
            booking.status = status;
            booking.updatedBy.push({
              name: admin.name,
              adminId: adminId,
              date: Date.now(),
            });
            await booking.save();
            return Response.json({ message: `Booking ${status}` }, { status: 200 });
        }
        else if (booking.status === 'Cancelled' && status === 'Restart') {
            
            booking.status = status;
            booking.updatedBy.push({
              name: admin.name,
              adminId: adminId,
              date: Date.now(),
            });
            await booking.save();
            return Response.json({ message: `Booking ${status}` }, { status: 200 });
        }

        else if (booking.status === 'Cancelled') {
            return Response.json({ message: "Booking already  Cancelled" }, { status: 400 });
        }
        
        else if (booking.status === 'Confirmed' && status === 'Cancelled') {
            booking.status = status;
            console.log(status);
            booking.updatedBy.push({
              name: admin.name,
              adminId: adminId,
              date: Date.now(),
            });
            await booking.save();
            return Response.json({ message: `Booking ${status}` }, { status: 200 });
        }

        else if(booking.status === 'Initialized' && status === 'Cancelled'){


             booking.status = status;
            booking.updatedBy.push({
              name: admin.name,
              adminId: adminId,
              date: Date.now(),
            });
            booking.allotedVehicle = [];
            await booking.save();

            if(exitingOrder)
               await Order.deleteOne({_id:exitingOrder._id});

            return Response.json({message:`Order ${status}`},{status:200});

        }

        else if (booking.status === 'Confirmed' && status === 'Pending') {
            return Response.json({ message: `Booking can not be in pending state` }, { status: 400 });
        }
        else if (booking.status === "Dispatched" && status === "In Transit") {
            booking.status = status;
            booking.updatedBy.push({
              name: admin.name,
              adminId: adminId,
              date: Date.now(),
            });
            await booking.save();
            if(exitingOrder){
                exitingOrder.status = status;
                exitingOrder.updatedBy.push({
                  name: admin.name,
                  id: adminId,
                  date: Date.now(),
                });

                await exitingOrder.save();
            }
            return Response.json({ message: `Booking ${status}` }, { status: 200 });
        }
            
        else if (booking.status === "In Transit" && status === "Delivered") {
         
            booking.status = status;
            booking.updatedBy.push({
              name: admin.name,
              adminId: adminId,
              date: Date.now(),
            });
            await booking.save();
            if(exitingOrder){
                 exitingOrder.isDelevered = true;
                exitingOrder.status = status;
                exitingOrder.updatedBy.push({
                  name: admin.name,
                  id: adminId,
                  date: Date.now(),
                });

                await exitingOrder.save();
            }
           
            return Response.json({ message: `Booking ${status}` }, { status: 200 });
            
        }
            

        else {
            return Response.json({ message: "Invalid request" }, { status: 400 });
        } 
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });  
    }

  }
 

export function GET(req, res) {
    return Response.json({ message: "Invalid request" }, { status: 500 });
}