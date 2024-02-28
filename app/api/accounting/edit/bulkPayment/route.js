import connectDB from "../../../../middleware/connectDB";
import bulkPayment from "../../../../models/accounting/bulkPayment";
import usermodel from "../../../../models/usermodel";

export async function PUT(req, res) {

    try {
        const { adminId, _id, fieldsToUpdate } = await req.json();
        await connectDB();

        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if(!admin) {
            return Response.json({ message: "Admin not found" }, { status: 400 });
        }
        

        const bulkPay = await bulkPayment.findOne({ _id });
        if (!bulkPay) {
            return Response.json({ message: "Bulk Payment not found" }, { status: 400 });
        }

        for (const key in fieldsToUpdate) {
            bulkPay[key] = fieldsToUpdate[key];
        }

        const updated = {
            name: admin.name,
            adminId,
            date: new Date(),
        };

        if (bulkPay.updatedBy) bulkPay.updatedBy.push(updated);
        else {
            bulkPay.updatedBy = [];
            bulkPay.updatedBy.push(updated);
        }

        const data = await bulkPay.save();

        return Response.json({ message: "Bulk Payment updated successfully", data }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }

}