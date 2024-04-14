import usermodel from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";
import quotemodel from "../../../../models/quoteModel";


export async function GET(req, context) {

    try {
        
        // const adminId = context.params;

        const { _id } = context.params;
      
        const queryParams = _id.split("&&");

        // Initialize variables to store _id and adminId
        let id, adminId;

        // // Loop through each query parameter to find _id and adminId
        queryParams.forEach((param) => {
          // Split each query parameter by "=" to separate key and value
          const [key, value] = param.split("=");

          // Check if the key is "_id" or "adminId" and assign the value accordingly
          if (key === "_id") {
            id = value;
          } else if (key === "adminId") {
            adminId = value;
          }
        });

        // return Response.json(
        //     {
        //         _id,
        //         id: id,
        //         adminId: adminId,
        //         message: "hey bro "
        //     },
        //   { status: 400 },
        // );


        await connectDB();


        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });

        if(!admin){
            return Response.json({ message: "Admin not found", success: false }, { status: 400 });
        }


        const quotes = await quotemodel.findOne({_id:id});
        return Response.json({ message: "Quotes found", data: quotes, success: true }, { status: 200 });
    
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message, success: false }, { status: 400 });
    }
}