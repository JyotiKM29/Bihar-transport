import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    
    try {
        
        await connectDB();
        const { resetToken, newPassword, confirmPassword } = await req.json();

         if (!resetToken) {
        return Response.json({message: "Reset token is not valid" },{status:400});
      }

      const existingUser = await user.findOne({ resetToken });

      if (!existingUser) {
        return Response.json({message: "Reset token is not valid" },{status:400});
      }

      if (existingUser.resetTokenExpiresAt < Date()) {
          return NextResponse.json({
          message: "Reset token expired. Please create another token again.",
        },{status:400});
      }

      if (newPassword !== confirmPassword) {
        return Response
          .json({message: "Confirm password and password are not matching" },{status:400});
      }

      // Update the user's password and reset token expiration time
      existingUser.password = newPassword;
      existingUser.resetTokenExpiresAt = new Date();
      existingUser.resetToken = null;
      const result = await existingUser.save();

      return Response.json({
        user: result,
        message: "Password changed successfully",
        status: "success",
      },{status:200});
        
    } catch (error) {
        
        console.log(error);
        return Response.json({ message: "error", error: error.messsage },{status:400});

    }


}
