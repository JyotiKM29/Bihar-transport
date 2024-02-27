import connectDB from "../../../../../middleware/connectDB";
import bulkPayment from "../../../../../models/accounting/bulkPayment";


export async function GET(req, context) {
  try {
    const { params } = context;
    const _id = params._id;
      await connectDB();
      
    const data = await bulkPayment.findOne({ _id });
    
    if (!data) {
      return Response.json({ message: "Bulk Payment not found" }, { status: 404 });
    }
      // console.log("hey",categories);
        return Response.json(
            { message: "successfull", data },
            { status: 200 },
      );
      
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
