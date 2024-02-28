import receipt from "../../../../models/accounting/reciept";
import user from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";

export async function PUT(req, context) {
  try {
    const { adminId, _id, feildsToUpdate } = await req.json();

    await connectDB();
    const admin = await user.findOne({
      $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
    });

    if (!admin) {
      return Response.json({ message: "Admin not found" }, { status: 404 });
    }

    const updatedReceipt = await receipt.findOne({ _id });
    if (!updatedReceipt) {
      return Response.json({ message: "Receipt not found" }, { status: 404 });
    }

    // update all the components coming from feildsToUpdate
    for (const key in feildsToUpdate) {
      updatedReceipt[key] = feildsToUpdate[key];
    }

    const updated = {
      name: admin.name,
      adminId,
      date: new Date(),
    };

    if (updatedReceipt.updatedBy) updatedReceipt.updatedBy.push(updated);
    else {
      updatedReceipt.updatedBy = [];
      updatedReceipt.updatedBy.push(updated);
    }

    const data = await updatedReceipt.save();

    return Response.json(
      { message: "Receipt updated successfully", data },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
