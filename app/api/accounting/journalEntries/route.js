import journal from "../../../models/accounting/journal";
import connectDB from "../../../middleware/connectDB";
import user from "../../../models/usermodel";

export async function POST(req, res) {

    try {
        const { adminId, date, from, to, debit, credit, narration } = await req.json();
        await connectDB();
        const admin = await user.findOne({
            $and: [{ _id: adminId },
            { $or: [{ isAdmin: true }, { isOwner: true }]
        }]
        });
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }


        const newJournal = new journal({
            createdBy: {
                name: admin.name,
                id: adminId,
            },
            date,
            from,
            to,
            debit,
            credit,
            narration,
        });
        await newJournal.save();
        return Response.json(newJournal, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }

}