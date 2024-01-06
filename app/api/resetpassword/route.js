import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    
    try {
        
        await connectDB();

        const { resetToken, newPassword, confirmPassword } = await req.json();

         if (!resetToken) {
        return Response.json({status:400, msg: "Reset token is not valid" });
      }

      const existingUser = await user.findOne({ resetToken });

      if (!existingUser) {
        return Response.json({status:400, msg: "Reset token is not valid" });
      }

      if (existingUser.resetTokenExpiresAt < Date()) {
          return NextResponse.json({
            status:400,
          msg: "Reset token expired. Please create another token again.",
        });
      }

      if (newPassword !== confirmPassword) {
        return Response
          .json({ staus:400, msg: "Confirm password and password are not matching" });
      }

      // Update the user's password and reset token expiration time
      existingUser.password = newPassword;
      existingUser.resetTokenExpiresAt = new Date();
      const result = await existingUser.save();

      return Response.json({
        user: result,
        msg: "Password changed successfully",
        status: "success",
      });
        
    } catch (error) {
        
        console.log(error);
        return Response.json({ msg: "error", error: error.messsage });

    }


}
