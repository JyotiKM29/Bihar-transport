import connectDB from "../../../../middleware/connectDB";
import usermodel from "../../../../models/usermodel";
import Type from "../../../../models/type";


export async function GET(req, context) {

    try {
        
        const { _id } = context.params;
        await connectDB();

        const admin = await usermodel.findOne({ $and: [{ _id }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "You are not authorized to view this type." }, { status: 401 });
        }

        const data = await Type.find();
        return Response.json(data, { status: 200 });


    } catch (error) {
        
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }

   

    

}