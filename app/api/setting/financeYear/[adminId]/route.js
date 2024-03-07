import settingmodel from "../../../../models/settingmodel";
import connectDB from "../../../../middleware/connectDB";
import usermodel from "../../../../models/usermodel";

export async function GET(req, context) {
    
    try {
        
        const adminId = context.params.adminId;
        await connectDB();

        const admin = await usermodel.find({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }

        const financeYearData = await settingmodel.find({}).sort({ createdAt: -1 }).limit(1);
        return Response.json(financeYearData.financeYear, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }

}