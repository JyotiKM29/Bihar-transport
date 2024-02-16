import ledger from "../../../models/accounting/ledgerModel";
import user from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";

export async function DELETE(req, res) {
  try {
    await connectDB();

    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
