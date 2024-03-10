import quoteModel from "../../../models/quoteModel";
import usermodel from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";

function generateUniqueQuoteNo() {
  return 'Q' + Date.now(); // Example: Q1632327950659
}



export async function POST(req, res) {
    

    try {
        const { adminId, quoteDate, quoteValidity, customerDetails, product } = await req.json();

        await connectDB();
        const admin = await usermodel.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        // console.log(adminId,admin);
        
        if(!admin){
            return Response.json({ message: "Admin not found", success: false }, { status: 400 });
        }



        if (!customerDetails.customerId) {
            return Response.json({ message: "customerId is required", success: false }, { status: 400 });

        }

        

            const already = await quoteModel.findOne({ "customerDetails.customerId": customerDetails.customerId });
            if (already) {
                 const quoteNo = generateUniqueQuoteNo();
                const data = {
                    quoteNo,
                    product,
                    quoteDate,
                    quoteValidity,
                    createdBy: {
                        name: admin.name,
                        id: admin._id
                    },
                }
                already.product.push(data);
                await already.save();
            }

            else {
                const quoteNo = generateUniqueQuoteNo();
                const quote = new quoteModel({
                    quoteNo,
                    quoteDate,
                    quoteValidity,
                    customerDetails,
                    product,
                    createdBy: {
                        name: admin.name,
                        id: admin._id
                    },
                });
                await quote.save();
            }

        return Response.json({ message: "Quote created successfully" }, { status: 200 });
        

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message, success: false }, { status: 400 });
    }



}