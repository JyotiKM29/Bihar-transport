import connectDB from "../../../../middleware/connectDB";
import bulkRecieve from "../../../../models/accounting/bulkRecieve"


export async function GET(req, context) {
  try {
    const { params } = context;
    const _id = params._id;
      await connectDB();
      
      const data = await bulkRecieve.findOne({ _id });
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
