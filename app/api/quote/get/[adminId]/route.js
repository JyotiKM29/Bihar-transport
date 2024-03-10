import usermodel from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";
import quotemodel from "../../../../models/quoteModel";


export async function GET(req, context) {

    try {
        
        const adminId = context.params.adminId;
        await connectDB();


        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });

        if(!admin){
            return Response.json({ message: "Admin not found", success: false }, { status: 400 });
        }


        const quotes = await quotemodel.find({});
    return Response.json({ message: "Quotes found", data: quotes, success: true }, { status: 200 });
    
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message, success: false }, { status: 400 });
    }
}