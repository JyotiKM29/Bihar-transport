import usermodel from "@/app/models/usermodel";
import connectDB from "@/app/middleware/connectDB";
import biltyType  from '@/app/models/setting/biltyType';

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

    const data = await biltyType.find({}).sort({ _id: -1 });

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
