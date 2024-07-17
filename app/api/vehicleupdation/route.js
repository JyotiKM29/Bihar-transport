// import { User } from "lucide-react";
import connectDB from "../../middleware/connectDB";
import vehicle from "../../models/vehicleModel";
import user from "../../models/usermodel";

export async function PUT(req, res) {
  try {
    await connectDB();

  const { _id, adminId,  fieldsToUpdate } = await req.json();

    const admin = await user.findOne({ _id: adminId });
    if (admin && (admin.isAdmin || admin.isOwner)) {
      const existingVehicle = await vehicle.findOne({ _id });
      if (!existingVehicle) {
        return Response.json(
          { message: "Vehicle Not found" },
          { status: 400 },
        );
      }

      const date = Date();
      
      // Object.keys(fieldsToUpdate).forEach((field) => {
      //   existingVehicle[field] = fieldsToUpdate[field];
      // });

       for (const fieldPath in fieldsToUpdate) {
         const fieldValue = fieldsToUpdate[fieldPath];
         // Split the nested field path using dots
         const fieldPathParts = fieldPath.split(".");
         // Traverse the nested structure to update the field
         let nestedObj = existingVehicle;
         for (let i = 0; i < fieldPathParts.length - 1; i++) {
           nestedObj = nestedObj[fieldPathParts[i]];
         }
         // Update the actual field value
         nestedObj[fieldPathParts[fieldPathParts.length - 1]] = fieldValue;
       }




      if (!existingVehicle.updatedBy) {
        existingVehicle.updatedBy = []; // Initialize if not present
      }
      existingVehicle.updatedBy.push({
        name: admin.name,
        adminId: admin._id.toString(),
        date: date,
      });
      const updatedVehicle = await existingVehicle.save();

      // console.log(updatedVehicle);
      // console.log("Vehicle Updated:", updatedVehicle);


      return Response.json(
        {
          message: "Vehicle Updated successfully",
          vehicle: updatedVehicle,
        },
        { status: 200 },
      );
    } else {
      return Response.json(
        { message: "admin does not exist" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error adding vehicle to the database:", error.message);

    return Response.json(
      {
        message: "Error adding vehicle to the database",
        error: error.message,
      },
      { status: 404 },
    );
  }
}

export async function GET(req, res) {
  return Response.json(
    {
      message: "Method Not Allowed",
    },
    { status: 405 },
  );
}
