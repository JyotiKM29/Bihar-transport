import moneyTransfer from "../../../../models/accounting/moneyTransfer";
import connectDB from "../../../../middleware/connectDB";

export async function GET(req, context) {

    try {
        const { _id } = context.params;
        console.log(_id);
        await connectDB();

        const moneyTransferData = await moneyTransfer.findOne({ _id });

        if (!moneyTransferData) return Response.json({ message: "Money Transfer not found" }, { status: 404 });

        return Response.json({ message: "Money Transfer Details", data: moneyTransferData }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }

}
