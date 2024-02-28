import { expanse } from "../../../../models/accounting/expanse";
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

        const exp = await expanse.findOne({ _id });
        if (!exp) {
            return Response.json({ message: "Expanse not found" }, { status: 400 });
        }

        for (const key in fieldsToUpdate) {
            exp[key] = fieldsToUpdate[key];
        }

        const updated = {
            name: admin.name,
            adminId,
            date: new Date(),
        };

        if (exp.updatedBy) exp.updatedBy.push(updated);
        else {
            exp.updatedBy = [];
            exp.updatedBy.push(updated);
        }

        const data = await exp.save();

        return Response.json(
            { message: "Expanse updated successfully", data },
            { status: 200 },
        );
        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}

export function POST(req, res) {
    return Response.json(
        { message: "THis method is not allowed" },
        { status: 405 },
    );
}

export function GET(req, res) {
    return Response.json(
        { message: "THis method is not allowed" },
        { status: 405 },
    );
}

