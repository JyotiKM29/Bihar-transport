import connectDB from "../../../middleware/connectDB"
import Type from "../../../models/type"
import user from "../../../models/usermodel"


export async function POST(req, res) {

    try {

        const { name, length, lengthUnit, width, widthUnit, height, heightUnit, weight, weightUnit, adminId } = await req.json();

        await connectDB();
        const admin = await user.findOne({ $and: [{ _id: adminId }, { $or: [{ isAdmin: true }, { isOwner: true }] }] });
        
        if (!admin) {
            return Response.json({ message: "You are not authorized to create a type." }, { status: 401 });
        }

        const data = new Type({
            name,
            length,
            lengthUnit,
            width,
            widthUnit,
            height,
            heightUnit,
            weight,
            weightUnit,
            addedBy: { name: admin.name, adminId: adminId }
        });

        // console.log(data);


        await data.save();

        return Response.json({ message: "Type created successfully." }, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message }, { status: 400 });
    }


}


