import usermodel from "@/app/models/usermodel";
import receivable from "@app/models/receivable";
import connectDB from "@/app/middleware/connectDB";

export async function DELETE(req, res) {
  try {
    const { adminId, id } = await req.json();
    await connectDB();

    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });
    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 400 });
    }

    if (!id) {
      return Response.json({ message: " found" }, { status: 400 });
    }

    const trip = await receivable.findByIdAndDelete(id);

    return Response.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
