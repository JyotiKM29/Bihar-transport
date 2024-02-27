import receipt from "../../../../models/accounting/reciept";
import connectDB from "../../../../middleware/connectDB";

export async function GET(req, context) {
    try {
        const { _id } = context.params;
        console.log(_id);
        await connectDB();
    
        const receiptData = await receipt.findOne({ _id });
        return Response.json({ message: "Receipt Details", data: receiptData }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
    
}