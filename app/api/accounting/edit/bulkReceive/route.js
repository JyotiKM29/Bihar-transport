import bulkRecieve from "../../../../models/accounting/bulkRecieve";
import usermodel from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";

export async function PUT(req, res) {

    try {
        
        const { adminId, _id, fieldsToUpdate } = await req.json();
        await connectDB();

        const admin = await usermodel.findOne({
            $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }

        const bulkRec = await bulkRecieve.findOne({ _id });
        if (!bulkRec) {
            return Response.json({ message: "Bulk Recieve not found" }, { status: 400 });
        }

        for (const key in fieldsToUpdate) {
            bulkRec[key] = fieldsToUpdate[key];
        }

        const updated = {
            name: admin.name,
            adminId,
            date: new Date(),
        };

        if (bulkRec.updatedBy) bulkRec.updatedBy.push(updated);
        else {
            bulkRec.updatedBy = [];
            bulkRec.updatedBy.push(updated);
        }

        const data = await bulkRec.save();

        return Response.json(
            { message: "Bulk Recieve updated successfully", data },
            { status: 200 },
        );

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }



}