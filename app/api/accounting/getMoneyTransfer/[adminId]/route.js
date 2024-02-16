import connectDB from "../../../../middleware/connectDB";
import moneyTransfer from "../../../../models/accounting/moneyTransfer";
import user from "../../../../models/usermodel";


export async function GET(req, context) {

    try {
        await connectDB();
        const { params } =  context;
        const admin = await user.findOne({
            $and: [
                { _id: params.adminId },
                { $or: [{ isAdmin: true }, { isOwner: true }] },
            ],
        });

        if(!admin){
            return Response.json({ message: "admin does not exist" }, { status: 400 });
        }

        const transferData = await moneyTransfer.find();
        return Response.json({ message: "Money transfer data fetched successfully", data: transferData }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }


}

