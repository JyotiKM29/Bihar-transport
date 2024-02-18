import user from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";
import journal from "../../../../models/accounting/journal";

export async function GET(req, context) {
  try {
    const { params } = context;
    const adminId = params.adminId;
    await connectDB();
    const admin = await user.findOne({
      $and: [
        { _id: adminId },
        {
          $or: [{ isAdmin: true }, { isOwner: true }],
        },
      ],
    });
    if (!admin) {
      return Response.json(
        { message: "Admin does not exist" },
        { status: 404 },
      );
    }
    const data = await journal.find();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req, res) {

    return Response.json({ message: "This method is not allowed" }, { status: 501 });

}
