import Booking from "../../../models/bookingmodel";
import usermodel from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";

export async function POST(req, res) {
  try {
   const { adminId, fromDate, toDate } = await req.json();

   await connectDB();

   const admin = await usermodel.findOne({
     $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
   });

   if (!admin) {
     return Response.json({ message: "Admin not found" }, { status: 404 });
   }

   const aggregationPipeline = [
     {
       $match: {
         createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
       },
     },
     {
       $group: {
         _id: null,
         totalBooking: { $sum: 1 },
         confirmedBooking: {
           $sum: { $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0] },
         },
         cancelledBooking: {
           $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
         },
       },
     },
   ];

   const [result] = await Booking.aggregate(aggregationPipeline);

   const data = {
     totalBooking: result.totalBooking || 0,
     confirmedBooking: result.confirmedBooking || 0,
     cancelledBooking: result.cancelledBooking || 0,
   };

   return Response.json({ data }, { status: 200 });

  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
