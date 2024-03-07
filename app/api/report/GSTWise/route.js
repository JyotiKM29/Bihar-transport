import usermodel from "../../../models/usermodel";
import Booking from "../../../models/bookingmodel";
import connectDB from "../../../middleware/connectDB";


export async function POST(req, res) {

    try {
        
        const { adminId } = await req.json();
        await connectDB();

        const admin = await usermodel.findOne({
            $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }

        const bookings = await Booking.find({});
        const gstWise = {};
      bookings.forEach((booking) => {
        // Check if itemList exists and is an array
        if (booking.itemList && Array.isArray(booking.itemList)) {
          booking.itemList.forEach((item) => {
            if (gstWise[item.GSTType]) {
              // Increment count for existing GST type
              gstWise[item.GSTType] += 1;
            } else {
              // Initialize count for new GST type
              gstWise[item.GSTType] = 1;
            }
          });
        }
      });
        return Response.json(gstWise, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}