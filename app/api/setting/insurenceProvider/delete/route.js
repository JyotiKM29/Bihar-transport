import usermodel from "@/app/models/usermodel";
import insurenceProvider from "@/app/models/setting/insurenceProvider";
import connectDB from "@/app/middleware/connectDB";

export async function DELETE(req, res) {
  try {
    const { adminId, id } = await req.json();

    console.log("id: ", id);
    await connectDB();

    const admin = await usermodel.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });
    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 400 });
    }

    if (!id) {
      return Response.json({ message: "Trip Type not found" }, { status: 400 });
    }

    const trip = await insurenceProvider.findByIdAndDelete(id);
    console.log("deleted");

    return Response.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
