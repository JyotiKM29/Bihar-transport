import usermodel from "../../../../models/usermodel";
import ledger from "../../../../models/accounting/ledgerModel"
import connectDB from "../../../../middleware/connectDB";

export async function GET(req, context) {


    try {
      
        
        const { _id } = context.params;
        console.log(_id);
        await connectDB();

        const ledgerData = await ledger.findOne({ _id });
        return Response.json({ message: "Ledger Details", data:ledgerData }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message}, { status: 400 });
    }
    
}