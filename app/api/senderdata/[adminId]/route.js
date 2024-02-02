import connectDB from "../../../middleware/connectDB";
import user from "../../../models/usermodel";
import consigee from "../../../models/consigermodel";

export async function GET(req, context) {
  try {
    await connectDB();
    console.log("yes");
    const { params } = context;

      const admin = await user.findOne({ $and: [{ _id: params.adminId }, {$or:[{isAdmin:true},{isOwner:true}]}]});

    console.log(admin);
    if (admin) {
      // Create a new booking

      const newdata = await consigee.find();
      return Response.json(
        {
          newdata,
        },
        { status: 200 },
      );
    } else {
      return Response.json(
        { message: "admin does not exist" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error getting Booking to the database:", error.message);

    return Response.json(
      {
        message: "Error adding booking ",
        error: error.message,
      },
      { status: 404 },
    );
  }
}

export async function POST(req, res) {
  return Response.json(
    {
      message: "Method Not Allowed",
    },
    { status: 405 },
  );
}
