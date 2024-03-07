import settingmodel from "../../../models/settingmodel";
import usermodel from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";

export async function POST(req, res) {

    try {

        const { adminId, financeYear } = await req.json();    
        await connectDB();

        const admin = await usermodel.findOne({
          $and: [
            { _id: adminId },
            { $or: [{ isAdmin: true }, { isOwner: true }] },
          ],
        });
        if (!admin || !admin.name || !admin._id) {
          return Response.json(
            { message: "Admin not found or missing required fields" },
            { status: 400 },
          );
        }

        console.log(admin.name, admin._id, financeYear);

        const financeYearData = new settingmodel({
          financeYear,
          createdBy: {
            adminId,
            name: admin.name,
          },
        });

        await financeYearData.save();
        
        return Response.json({message:"Successfully Created"}, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }



}

