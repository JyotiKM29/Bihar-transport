import usermodel from "@/app/models/usermodel";
import paymentMode from "@/app/models/setting/paymentMode";
import connectDB from "@/app/middleware/connectDB";

export async function POST(req, res) {
  try {
    const { adminId, name } = await req.json();
    await connectDB();

    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });
    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 400 });
    }

    const data = new paymentMode({
      name,
      addedBy: {
        name: admin.name,
        id: admin._id,
      },
    });

    await data.save();
    return Response.json(
      { message: "Additional Charges created successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
