import connectDB from "../../../middleware/connectDB";
import user from "../../../models/usermodel";


export async function GET(req, context) {

    try {
        
    await connectDB();
    const { params } = context;

    // check if owner exists
        const owner = await user.findOne({ _id: params.ownerId });

    if (!owner.isOwner) {
      return Response.json({ message: "Owner not found" }, { staus: 400 });
    }

    const users = await user.find({}, { password: 0, loginHistory: 0 });
    return Response.json({ users }, { staus: 200 });
    } catch (error) {
        
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}


export function POST(req, context) {
    return Response.json({ message: "Method not allowed" },{staus:400});
}   

