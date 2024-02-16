import connectDB from "../../../../middleware/connectDB";
import ledger from "../../../../models/accounting/ledgerModel";
import user from "../../../../models/usermodel";
import { log } from 'console';


export async function GET(req, context) {
    
    try {
        await connectDB();
        const { params } =  context;
        // console.log(params.adminId);
         const admin = await user.findOne({
           $and: [
             { _id: params.adminId },
             { $or: [{ isAdmin: true }, { isOwner: true }] },
           ],
         });
        // log(admin);
        
        if(!admin){
            return Response.json({ message: "admin does not exist" }, { status: 400 });
        }

        const ledgerData = await ledger.find();
        return Response.json({ message: "Ledger data fetched successfully", data: ledgerData }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }

}



export async function POST(req, res) {
    return Response.json({ message: "THis method is not allowed" }, { status: 405 });
}