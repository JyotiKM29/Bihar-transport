import user from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";
import moneyTransfer from "../../../../models/accounting/moneyTransfer";
import receipt from "../../../../models/accounting/reciept";


export async function GET(req, context) {

    try {
        
        await connectDB();
        const { params } = context;
        const admin = await user.findOne({
            $and: [
                { _id: params.adminId },
                { $or: [{ isAdmin: true }, { isOwner: true }]
            }]
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }

        const receiptData = await receipt.find();
        return Response.json({ message: "Receipt data fetched successfully", data: receiptData }, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }

}