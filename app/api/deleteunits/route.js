import usermodel from "@/app/models/usermodel";
import connectDB from "@/app/middleware/connectDB";
import unitmodel from "@/app/models/unitmodel";

export async function DELETE(req, res) {
      try {
        const { adminId, unitId } = await req.json();
      
            await connectDB();
        const admin = await usermodel.findOne({
          $and: [
            { _id: adminId },
            { $or: [{ isAdmin: true }, { isOwner: true }] },
          ],
        });
            
            if (!admin) {
                return Response.json({ message: "Admin not found" }, { status: 400 });
            }

            if (!unitId) {
                return Response.json({ message: "Unit not found" }, { status: 400 });
            }

            const unit = await unitmodel.findByIdAndDelete(unitId);

          return Response.json({ message: "Unit deleted successfully" }, { status: 200 });

        } catch (error) {
          console.log(error);
            return Response.json({ message: error.message }, { status: 400 });
        }
}