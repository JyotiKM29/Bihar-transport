import settingmodel from "../../../models/settingmodel";
import usermodel from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";

export async function POST(req, res) {

    try {
        
        const { adminId, financeYear } = await req.json();    
        await connectDB();

        const admin = await usermodel.find({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }

        const financeYearData = await settingmodel.create({ financeYear });
        return Response.json({message:"Successfully Created"}, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }



}

