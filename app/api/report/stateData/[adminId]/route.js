import usermodel from "@/app/models/usermodel";
import bookingmodel from "@/app/models/bookingmodel";
import connectDB from "@/app/middleware/connectDB";

export async function GET(req, context) {
  try {
    const { adminId } = context.params;

    await connectDB();

    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });

    if (!admin) {
        return Response.json({ message: "Admin not found" }, { status: 404 });
    }

    const aggregationPipeline = [
      {
        $unwind: "$loadingPoints",
      },
      {
        $unwind: "$unloadingPoints",
      },
      {
        $addFields: {
          state: {
            $cond: {
              if: {
                $gt: [{ $indexOfCP: ["$loadingPoints", ","] }, -1],
              },
              then: {
                $arrayElemAt: [{ $split: ["$loadingPoints", ", "] }, -2],
              },
              else: "$loadingPoints",
            },
          },
        },
      },
      {
        $group: {
          _id: "$state",
          totalBooking: { $sum: 1 },
          confirmedBooking: {
            $sum: { $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0] },
          },
          deliveredBooking: {
            $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
          },
          cancelledBooking: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
          },
          totalAmount: { $sum: "$totalBillingAmount" },
          totalPaidAmount: { $sum: "$totalPaidAmount" },
        },
      },
      {
        $sort: { totalBooking: -1 }, // Sorting by totalBooking in descending order
      },
    ];

    const results = await bookingmodel.aggregate(aggregationPipeline);

      return Response.json({ results }, { status: 200 });
  } catch (error) {
    console.log(error);
   return Response.json({ message: error.message }, { status: 400 });
  }
}
