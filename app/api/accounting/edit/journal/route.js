import journal from "../../../../models/accounting/journal";
import usermodel from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";

export async function PUT(req, res) {

    try {
    
        const { adminId, _id, fieldsToUpdate } = await req.json();
        await connectDB();

        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }

        const journalEntry = await journal.findOne({ _id });
        if (!journalEntry) {
            return Response.json({ message: "Journal Entry not found" }, { status: 400 });
        }

        for (const key in fieldsToUpdate) {
            journalEntry[key] = fieldsToUpdate[key];
        }

        const updated = {
            name: admin.name,
            adminId,
            date: new Date(),
        };

        if (journalEntry.updatedBy) journalEntry.updatedBy.push(updated);
        else {
            journalEntry.updatedBy = [];
            journalEntry.updatedBy.push(updated);
        }

        const data = await journalEntry.save();

        return Response.json({ message: "Journal Entry updated successfully", data }, { status: 200 });

        

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}



