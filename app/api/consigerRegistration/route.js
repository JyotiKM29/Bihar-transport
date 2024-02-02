import connectDB from "../../middleware/connectDB";
import consigee from "../../models/consigermodel";
import user from "../../models/usermodel";

export async function POST(req, res) {
  try {
    await connectDB();

    const { adminId, type, consignorData } = await req.json();
    console.log("Consignor Data:", consignorData);

    // Check if adminId is present
    if (!adminId) {
      return Response.json(
        {
          message: "Admin ID not found",
        },
        { staus: 400 },
      );
    }

    // Check if an admin or owner exists
    const adminOrOwner = await user.findOne({
      _id: adminId,
      $or: [{ isAdmin: true }, { isOwner: true }],
    });

    if (!adminOrOwner) {
     return Response.json(
       {
         message: "Admin or Owner not found",
       },
       { staus: 400 },
     );
    }

      // Check if the consignor already exists
      const existingConsignor = await consigee.findOne(
        { "personal.contactNo": consignorData.contactNo, type: "personal" },
    );
    
    console.log("personal", existingConsignor)
      
      const company = await consigee.findOne(
        { "company.gstin": consignorData.gstin, type: "company" },
    );
    
    console.log("company", company);

    if (existingConsignor || company) {
     return Response.json(
       {
         message: "Consignor already exists",
       },
       { staus: 500 },
     );
    }

    // Create a new consignor with all the fields from the frontend
    const newConsignor = new consigee({
      type,
      ...(type === "company"
        ? { company: consignorData }
        : { personal: consignorData }),
    });

    // Save the new consignor
    const savedConsignor = await newConsignor.save();

    console.log("Consignor Created:", savedConsignor);

   return Response.json(
     {
       message: "Consignor created successfully",
       consignor: savedConsignor,
     },
     { staus: 200 },
   );
  } catch (error) {
    console.error("Error while creating consignor:", error.message);

      return Response.json({
        message: "Error creating consignor",
        error: error.message,
      },{staus:500});
  }
}
