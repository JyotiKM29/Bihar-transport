import connectDB from "../../../middleware/connectDB";
import user from "../../../models/usermodel";


export async function GET(req, context) {

    try {
        
    await connectDB();
    const { params } = context;

    // check if owner exists
    const owner = await user.findById(params.ownerId);

    if (!owner.isOwner) {
      return Response.json({ message: "Owner not found" }, { staus: 400 });
    }

    const users = await user.find();
    return Response.json({ admin }, { staus: 200 });
    } catch (error) {
        
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}


export function POST(req, context) {
    return Response.json({ message: "Method not allowed" },{staus:400});
}   

