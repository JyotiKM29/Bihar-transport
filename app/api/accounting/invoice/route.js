import Booking from "../../../models/bookingmodel";
import usermodel from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";

export async function POST(req, res) {

    try {
        
        const { adminId, bookingId } = await req.json();
        await connectDB();

        const admin = await usermodel.findOne({
            $and: [
                { _id: adminId },
                { $or: [{ isAdmin: true }, { isOwner: true }] },
            ],
        });


        if (!admin) {
            return Response.json(
                { message: "Admin not found or missing required fields" },
                { status: 400 },
            );
        }

        const booking = await Booking.findOne({ _id: bookingId });
        if (!booking) {
            return Response.json(
                { message: "Booking not found" },
                { status: 400 },
            );
        }

       if(!booking.invoiceStatus) booking.invoiceStatus = true;
        booking.updatedBy.push({
            adminId,
            name: admin.name,
            date: new Date(),
        });

        booking.generatedInvoice = {
            invoiceNumber: Math.floor(100000 + Math.random() * 900000),
            invoiceDate: new Date(),
            invoiceAmount: booking.partyBhara,
            invoiceTotal: booking.partyBhara,
            invoiceRemarks: "Invoice Generated",
        };
        

        const data = await booking.save();
        return Response.json({ message: "Invoice Generated", data }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }


}
