import connectDB from "../../../middleware/connectDB";
import ledger from "../../../models/ledgermodel";
import user from "../../../models/usermodel";

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
            return Response.json({ message: "admin does not exist" }, { status: 400 });
        }

        const existingLedger = await ledger.findOne({ _id });

        if (!existingLedger) {
            return Response.json({ message: "Ledger Not found" }, { status: 400 });
        }

        const date = Date();

        Object.keys(fieldsToUpdate).forEach((field) => {
            existingLedger[field] = fieldsToUpdate[field];
        });

        if (!existingLedger.updatedBy) {
            existingLedger.updatedBy = []; // Initialize if not present
        }
        existingLedger.updatedBy.push({
            name: admin.name,
            adminId: admin._id.toString(),
            date: date,
        });

        const savedLedger = await existingLedger.save();
        return Response.json({ message: "Ledger updated successfully", savedLedger }, { status: 200 });
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