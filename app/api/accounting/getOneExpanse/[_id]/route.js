import { expanse } from "../../../../models/accounting/expanse";
import usermodel from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";


export async function GET(req, context) {

    try { 
        const { _id } = context.params;
        console.log(_id);
        await connectDB();

        const expanseData = await expanse.findOne({ _id });
        return Response.json({ message: "Ledger Details", data:expanseData }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message}, { status: 400 });
    }
    
}