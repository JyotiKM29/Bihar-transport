import moneyTransfer from "../../../../models/accounting/moneyTransfer";
import user from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";

export async function PUT(req, res) {
  try {
    await connectDB();

    const { adminId, _id, fieldsToUpdate } = await req.json();
    const admin = await user.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });

    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 404 });
    }

    const mone = await moneyTransfer.findOne({ _id });
    if (!mone) {
      return Response.json(
        { message: "Money transfer not found" },
        { status: 404 },
      );
    }

    for (const key in fieldsToUpdate) {
      mone[key] = fieldsToUpdate[key];
    }

    const updated = {
      name: admin.name,
      adminId,
      date: new Date(),
    };

    if (mone.updatedBy) mone.updatedBy.push(updated);
    else {
      mone.updatedBy = [];
      mone.updatedBy.push(updated);
    }

    const data = await mone.save();
    return Response.json(
      { message: "Money transfer updated successfully", data },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export function GET(req, res) {
  return Response.json(
    { message: "THis method is not allowed" },
    { status: 405 },
  );
}
