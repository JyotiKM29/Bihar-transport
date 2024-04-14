// pages/api/updateBooking.js
import quote from "../../models/quoteModel";
import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";

export async function PUT(req, res) {
  try {
    await connectDB();
    console.log("yes");

    const { _id, adminId, fieldsToUpdate } = await req.json();

    console.log(_id, adminId, fieldsToUpdate);

     const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });

        if(!admin){
            return Response.json({ message: "Admin not found", success: false }, { status: 400 });
        }

      const existingQuote = await quote.findOne({ _id });

      const date = new Date();

      Object.keys(fieldsToUpdate).forEach((field) => {
        existingQuote[field] = fieldsToUpdate[field];
      });

       if (!existingQuote.updatedBy) {
         existingQuote.updatedBy = []; // Initialize if not present
       }
       existingQuote.updatedBy.push({
         name: admin.name,
         adminId: admin._id.toString(),
         date: date,
       });

      const updatedQuote = await existingQuote.save();

      console.log("Quotation Updated:", updatedQuote);

      return Response.json(
        {
          message: "Quotation updated successfully",
          booking: updatedQuote,
        },
        { status: 200 },
      );
    
  } catch (error) {
    console.error("Error updating Quotation:", error.message);

    return Response.json(
      {
        message: error.message,
      },
      { status: 400 },
    );
  }
}

export async function GET(req, res) {
  return Response.json({ message: "Method Not Allowed" }, { status: 400 });
}


export async function POST(req, res) {
  return Response.json({ message: "Method Not Allowed" }, { status: 400 });
}
