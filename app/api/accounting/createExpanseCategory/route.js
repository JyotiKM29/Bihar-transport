import { expanseCategory } from "../../../models/accounting/expanse";
import usermodel from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";

export async function POST(req, res) {

    try {
        
        const { adminId, name } = await req.json();
        await connectDB();
        const admin = await usermodel.findOne({
            $and: [{ _id: adminId },
                {
                    $or: [{ isAdmin: true }, { isOwner: true }]
                }]
        });
        if (!admin) {
            return Response.json({ message: "Admin does not exist" }, { status: 404 });
        }
        const existingCategory = await expanseCategory.findOne({ name: name });
        if (existingCategory) {
            return Response.json(
              { message: "Category already exists" },
              { status: 400 },
            );
        }
        const newCategory = new expanseCategory({ name });
        await newCategory.save();
        return Response.json(
          { message: "Category created successfully" },
          { status: 200 },
        );

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 500 });
    }


}