import ledger from "../../../models/accounting/ledger";
import user from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";


export async function DELETE(req, res) {

    try {
        await connectDB();
        




    } catch (error) {
        console.log(error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }


}
