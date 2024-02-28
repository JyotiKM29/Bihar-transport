import connectDB from "../../../../middleware/connectDB";
import ledger from "../../../../models/accounting/ledgerModel";
import user from "../../../../models/usermodel";

export async function PUT(req, res) {

    try {
      const { _id, adminId, fieldsToUpdate } = await req.json();

      await connectDB();
      const admin = await user.findOne({
        $and: [
          { _id: adminId },
          { $or: [{ isAdmin: true }, { isOwner: true }] },
        ],
      });

      if (!admin) {
        return Response.json(
          { message: "admin does not exist" },
          { status: 400 },
        );
      }

      const existingLedger = await ledger.findOne({ _id });

      if (!existingLedger) {
        return Response.json({ message: "Ledger Not found" }, { status: 400 });
      }

      const date = Date();

      // Update nested fields
      for (const fieldPath in fieldsToUpdate) {
        const fieldValue = fieldsToUpdate[fieldPath];
        // Split the nested field path using dots
        const fieldPathParts = fieldPath.split(".");
        // Traverse the nested structure to update the field
        let nestedObj = existingLedger;
        for (let i = 0; i < fieldPathParts.length - 1; i++) {
          nestedObj = nestedObj[fieldPathParts[i]];
        }
        // Update the actual field value
        nestedObj[fieldPathParts[fieldPathParts.length - 1]] = fieldValue;
      }

      // Object.keys(fieldsToUpdate).forEach((field) => {
      //   existingVehicle[field] = fieldsToUpdate[field];
      // });

    //   console.log(existingLedger);

      if (!existingLedger.updatedBy) {
        existingLedger.updatedBy = []; // Initialize if not present
      }
      existingLedger.updatedBy.push({
        name: admin.name,
        adminId: admin._id.toString(),
        date: date,
      });

      const savedLedger = await existingLedger.save();
      return Response.json(
        { message: "Ledger updated successfully", savedLedger },
        { status: 200 },
      );
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }
}


export async function GET(req, res) {

    return Response.json({ message: "this method is not allowed" }, { status: 405 });

}

export async function POST(req, res) {

    return Response.json({ message: "this method is not allowed" }, { status: 405 });

}