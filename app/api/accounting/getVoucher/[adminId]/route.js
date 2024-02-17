import voucher from "../../../../models/accounting/voucher";
import user from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";


export async function GET(req, context) {

    try {
        
        const { params } = context;
        const  adminId  = params.adminId;
        await connectDB();
        const admin = await user.findOne({
            $and: [{ _id: adminId },
                {
                    $or: [{ isAdmin: true }, { isOwner: true }]
                }]
        });
        if (!admin) {
            return Response.json({ message: "Admin does not exist" }, { status: 404 });
        }
        const vouchers = await voucher.find();
        return Response.json(vouchers, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }

}
