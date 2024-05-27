import usermodel from "@/app/models/usermodel";
import connectDB from "@/app/middleware/connectDB";
import reciept from "@/app/models/accounting/reciept";


export async function POST(req, res) {  

    try {

        const { adminId, fromDate, toDate } = await req.json();
        
        await connectDB();

        const admin = await usermodel.findOne({
            $and: [{ _id: adminId },
            { $or: [{isAdmin: true }, { isOwner: true }]
        }]
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }

    

        const from = new Date(fromDate);
        const to = new Date(toDate);

        const recieptData = await reciept.find({
          createdAt: {
            $gte: from,
            $lt: to,
          },
        });


        return Response.json({ recieptData }, { status: 200 });

        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }




}