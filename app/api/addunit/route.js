import user from "../../models/usermodel"
import connectDB from "../../middleware/connectDB";
import unitmodel from "../../models/unitmodel";


export async function POST(req, res) {
    
    try {
        
        const { adminId, unitName } = await req.json();
        await connectDB();
        const admin = await user.find({
            $and: [
                { _id: adminId }, // Condition 1: Find by adminId
                {
                    $or: [
                        { isAdmin: true }, // Condition 2: isAdmin should be true
                        { isOwner: true }, // Condition 3: isOwner should be true
                    ],
                },
            ],
        });

        if (!admin) {
            return Response.json({ message: "Admin not found" }, { status: 404 });
        }
        

        const unit = await unitmodel.create({
            name: unitName,
            addedBy: {
                name: admin.name,
                id: adminId
            }
        });
        


        return Response.json({ message: "Unit added successfully", unit }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }


}


