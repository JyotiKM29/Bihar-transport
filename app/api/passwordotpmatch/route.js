import usermodel from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";

export async function POST(req, res) {

   try {
     const { otp } = await req.json();

     const existingUser = await usermodel.findOne({ resetToken: otp });

     if (!existingUser) {
       return Response.json(
         {
           message: "Invalid OTP",
         },
         { status: 400 },
       );
     }

     if (existingUser.resetTokenExpiresAt < Date.now()) {
       return Response.json(
         {
           message: "OTP expired",
         },
         { status: 400 },
       );
     }

     return Response.json(
       {
         OTP: otp,
         message: "OTP verified",
       },
       { status: 200 },
     );
   } catch (error) {
       console.log(error);
        return Response.json(
          {
            message: error.message
          },
          { status: 400 },
        );
   }

}