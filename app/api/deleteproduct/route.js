import usermodel from "@/app/models/usermodel";
import connectDB from "@/app/middleware/connectDB";
import productmodel from "@/app/models/productmodel";


export async function DELETE(req, res) {
    
    try {
        
        const { adminId, id } = await req.json();
        await connectDB();

        const admin = await usermodel.find({
            $and: [
                { _id: adminId },
                {
                    $or: [{ isAdmin: true }, { isOwner: true }],
                },
            ],
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }
        
        if (!id) {
            return Response.json({ message: "id is missing" }, { status: 404 });
        }
        const product = await productmodel.findByIdAndDelete(id);


        return Response.json({ message: "Product deleted successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }





}