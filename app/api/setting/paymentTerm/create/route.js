import usermodel from "@/app/models/usermodel";
import paymentTerm from "@/app/models/setting/paymentTerm";
import connectDB from "@/app/middleware/connectDB";

export async function POST(req, res) {
  try {
    const { adminId, name, value } = await req.json();
    await connectDB();

    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });
    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 400 });
    }

    const data = new paymentTerm({
      name,
      value,
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
