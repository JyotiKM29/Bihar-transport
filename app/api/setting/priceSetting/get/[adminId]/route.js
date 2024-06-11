import usermodel from "@/app/models/usermodel";
import priceSetting from "@/app/models/setting/priceSetting";
import connectDB from "@/app/middleware/connectDB";



export async function GET(req, context) {
    

    try {
        
        const { adminId } = context.params;

        const parts = adminId.split("&");

        const id = parts[0];
        const page = parts[1];


        

        await connectDB();
        
        const admin = await usermodel.findOne({
          $and: [{ _id: id }, { $or: [{ isAdmin: true }, { isOwner: true }] }],
        });

        if (!admin) return Response.json({ message: "Admin not found" }, { status: 400 });


        const noOFDocument = await priceSetting.find({}).countDocuments();

        const data = await priceSetting.find({}).skip((page - 1) * 10).limit(10);


        return Response.json({ data, noOFDocument }, { status: 200 });
        






    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }





}