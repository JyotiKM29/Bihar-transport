import settingmodel from '../../../../models/settingmodel';
import usermodel from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";


export async function PUT(req, res) {
    
    try {

        const { adminId, _id, financeYear } = await req.json();
        await connectDB();

        const admin = await usermodel.find({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }

        const financeYearData = await settingmodel.findByIdAndUpdate
            ({ _id }, { financeYear }, { new: true });
        
        return Response.json({ message: "Successfully Updated" }, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }



}