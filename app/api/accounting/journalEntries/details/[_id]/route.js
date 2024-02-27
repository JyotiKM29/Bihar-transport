import journal from "../../../../../models/accounting/journal";
import connectDB from "../../../../../middleware/connectDB";


export async function GET(req, context) {
  try {
    const { _id } = context.params;
    console.log(_id);
    await connectDB();

      const journalData = await journal.findOne({ _id });
      if (journalData)
          return Response.json({ message: "Journal Details", data: journalData }, { status: 200 });
      
      else return Response.json({ message: "Journal not found" }, { status: 404 });
      
      
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }
}