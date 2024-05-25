import connectDB from "../../../middleware/connectDB";
import user from "../../../models/usermodel";
import unitmodel from "../../../models/unitmodel";


export async function GET(req,context){

    try {
        
        const { params } = context;
        await connectDB();
        const admin = await user.find({
            $and: [
                { _id: params.adminId },
                {
                    $or: [
                        { isAdmin: true },
                        { isOwner: true }
                    ]
                }
            ]
        });

        if (!admin) {
            return Response.json({ message: "admin not found" }, { status: 404 });
        }


        const data = await unitmodel.find().sort({_id:-1});

        return Response.json({ data }, { staus: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 404 });
    }




}