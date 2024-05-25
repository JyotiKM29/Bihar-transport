import usermodel from "@/app/models/usermodel";
import insurenceProvider from "@/app/models/setting/insurenceProvider";
import connectDB from "@/app/middleware/connectDB";

export async function GET(req, context) {
  try {
    const { adminId } = context.params;

    console.log(adminId);
    await connectDB();

    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });

    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 400 });
    }

    const data = await insurenceProvider.find({}).sort({_id:-1});

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
