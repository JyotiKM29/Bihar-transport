import usermodel from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";
import reciept from "../../../models/accounting/reciept";

export async function POST(req, res) {

    try {
        
        await connectDB();
        const {
          adminId,
          receivedFrom,
          recieptNo,
          recieptDate,
          receivedAmount,
          narration,
          TDS,
          discount,
          paidBy,
        } = await req.json();

        const admin = await usermodel.findOne({
            $and: [{ _id: adminId },
            { $or: [{isAdmin: true }, { isOwner: true }]
        }]
        });


        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }

        const recieptData = new reciept({
            recieptNo,
            receivedFrom,
            recieptDate,
            receivedAmount,
            narration,
            TDS,
            discount,
            paidBy,
            updatedBy: {
                name: admin.name,
                adminId,
                date: new Date(),
            }
        });

        await recieptData.save();
        return Response.json({ message: "Reciept created successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }


}