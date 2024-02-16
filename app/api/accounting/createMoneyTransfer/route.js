import connectDB from "../../../middleware/connectDB";
import user from "../../../models/usermodel";
import moneyTransfer from "../../../models/accounting/moneyTransfer";


export async function POST(req, res) {
    
    try {
        await connectDB();
        const { from, to, amount, narration, adminId } = await req.json();
        const admin = await user.findOne({
            $and: [{ _id: adminId },
            { $or: [{isAdmin: true }, { isOwner: true }]
        }]
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }

        const newTransfer = new moneyTransfer({
            from,
            to,
            amount,
            narration,
            updatedBy: {
                name: admin.name,
                adminId,
                date: new Date(),
            }
        });


        await newTransfer.save();
        return Response.json({ message: "Money transfer created successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }

}


export async function GET(req, res) {

    return Response.json({ messsage: "This method is not allowed" }, { status: 405 });

}
