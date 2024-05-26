import usermodel from "@/app/models/usermodel";
import ledger from "@/app/models/accounting/ledgerModel";
import bookingmodel from "@/app/models/bookingmodel";
import connectDB from "@/app/middleware/connectDB";


export async function GET(req,context){


    try {

        const { adminId } = context.params;
        await connectDB();


        // check if user is admin or owner or not

        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        if (!admin) {
            return Response.json({ message: "admin not found" }, { status: 400 });
        }


        // create a aggreate pipeline to get the customer wise report for all bookings, how much paid and how much is remaining

        // get all the customers form ledger
        const customer = await ledger.find().sort({ _id: -1 });

        const data = [];

        for (let i = 0; i < customer.length; i++) {





        
            
            const totalBooking = customer[i].booking?.length;
            const totalPaid = customer[i].advanceAmount;
            const totalRemaning = customer[i].totalAmount - customer[i].advanceAmount;
            const totalAmount = customer[i].totalAmount;

            const bookingData = {
                totalBooking: totalBooking || 0,
                totalPaid: totalPaid || 0,
                totalRemaining: totalRemaning || 0,
                totalAmount: totalAmount || 0
            };

            const name = customer[i].basicInfo.accountName;

            data.push({ [name]: bookingData });

        }

        return Response.json({ data: data }, { status: 200 });
        
        



    





        
    } catch (error) {
        console.log(error);
        return Response.json({ error: error.message }, { status: 400 });
    }



}