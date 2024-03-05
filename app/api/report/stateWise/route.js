import { log } from "console";
import connectDB from "../../../middleware/connectDB";
import Booking from "../../../models/bookingmodel";
import usermodel from "../../../models/usermodel";
import state from "../../../../stateData.json";
import { stat } from "fs";


// export async function POST(req, res) {

//     try {
//        const { adminId, stateName } = await req.json();
//      await connectDB();

//      // Check if the admin exists
//      const admin = await usermodel.findOne({
//        $and: [
//          { $or: [{ isAdmin: true }, { isOwner: true }] },
//          { _id: adminId },
//        ],
//      });

//      if (!admin) {
//        return Response.json({ message: "Admin not found" }, { status: 404 });
//      }

//      // Aggregation pipeline to generate state-wise report
//      const aggregationPipeline = [
//        {
//          $match: {
//            "loadingPoint[0]": stateName,
//          },
//        },
//        {
//          $group: {
//            _id: null,
//            totalBooking: { $sum: 1 },
//            confirmedBooking: {
//              $sum: { $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0] },
//            },
//            cancelledBooking: {
//              $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
//            },
//            deliveredBooking: {
//              $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
//            },
//          },
//        },
//      ];

//      // Execute the aggregation pipeline
//         const [result] = await Booking.aggregate(aggregationPipeline);
        
//         console.log("result ",result);

//      // Check if the result is undefined or empty
//      if (!result) {
//        return Response.json(
//          { message: "No bookings found for the provided state" },
//          { status: 404 },
//        );
//      }

//      // Prepare the response data
//      const data = {
//        totalBooking: result.totalBooking || 0,
//        confirmedBooking: result.confirmedBooking || 0,
//        cancelledBooking: result.cancelledBooking || 0,
//        deliveredBooking: result.deliveredBooking || 0,
//      };

//      // Send the response
//      return Response.json({ data }, { status: 200 });
//    } catch (error) {
//      console.error("Error generating state-wise report:", error);
//      return Response.json(
//        { message: "Internal Server Error" },
//        { status: 500 },
//      );
//    }

// }


export async function POST(req, res) {
    
    try {
      const { adminId, stateName } = await req.json();
      await connectDB();

      const admin = await usermodel.findOne({
        $and: [
          { _id: adminId },
          { $or: [{ isAdmin: true }, { isOwner: true }] },
        ],
      });

      if (!admin) {
        return Response.json({ message: "Admin not found" }, { status: 404 });
      }

      const booking = await Booking.find({});
      const data = state.states;
      const stateData = data.find((item) => item.state === stateName);

      if (!stateData) {
        return Response.json(
          { message: "No bookings found for the provided state" },
          { status: 404 },
        );
      }

      const districts = stateData.districts;
      const districtOrderCounts = {};

      // Initialize districtOrderCounts with 0 values for all districts
      districts.forEach((district) => {
        districtOrderCounts[district] = {
          totalOrders: 0,
          confirmedOrders: 0,
          deliveredOrders: 0,
          canceledOrders: 0,
        };
      });

      // Iterate through each booking
      booking.forEach((booking) => {
        // Check if the booking belongs to the specified state
        const loadingPoints = booking.loadingPoints;
        const matchedDistricts = new Set();

        // Check if any loading point contains a district name
        loadingPoints.forEach((loadingPoint) => {
          districts.forEach((district) => {
            if (loadingPoint.toLowerCase().includes(district.toLowerCase())) {
              matchedDistricts.add(district);
            }
          });
        });

        // Increment order counts for matched districts
        matchedDistricts.forEach((matchedDistrict) => {
          districtOrderCounts[matchedDistrict].totalOrders++;

          // Increment confirmed or canceled orders count based on booking status
          switch (booking.status) {
            case "Confirmed":
              districtOrderCounts[matchedDistrict].confirmedOrders++;
              break;
            case "Cancelled":
              districtOrderCounts[matchedDistrict].canceledOrders++;
              break;
            case "Delivered":
              districtOrderCounts[matchedDistrict].deliveredOrders++;
              break;
            default:
              break;
          }
        });
      });

      // Convert districtOrderCounts object to array of [key, value] pairs
      const districtOrderCountsArray = Object.entries(districtOrderCounts);

      // Sort the array based on totalOrders in descending order
      districtOrderCountsArray.sort(
        (a, b) => b[1].totalOrders - a[1].totalOrders,
      );

      // Convert sorted array back to an object
      const sortedDistrictOrderCounts = {};
      districtOrderCountsArray.forEach(([district, counts]) => {
        sortedDistrictOrderCounts[district] = counts;
      });

      // Returning the district counts
      return Response.json({ sortedDistrictOrderCounts }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });

    }


}