import connectDB from "../../../middleware/connectDB";
import { expanse } from "../../../models/accounting/expanse";
import usermodel from "../../../models/usermodel";

export async function POST(req, res) {

    try {
        const {
          adminId,
          expenseCategory,
            serviceCharge,
          serviceAccount,
          paidAmount,
          date,
          paidBy,
          remarks,
        } = await req.json();
        await connectDB();
        const admin = await usermodel.findOne({
            $and: [{ _id: adminId },
                {
                    $or: [{ isAdmin: true }, { isOwner: true }]
                }]
        });
        if (!admin) {
            return Response.json({ message: "Admin does not exist" }, { status: 404 });
        }

        const newExpanse = new expanse({
          expenseCategory,
          serviceCharge,
          serviceAccount,
          paidAmount,
          date,
          paidBy,
            remarks,
            createdBy: {
                adminId: adminId,
                name: admin.name,
               date: new Date()
          }
        });
        await newExpanse.save();
        return Response.json({ message: "Expanse created successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }
}