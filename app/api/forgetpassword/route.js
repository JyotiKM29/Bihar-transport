import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req, res) {
    
    await connectDB();
    const { email } = await req.json();

    const existinguser = await user.findOne({email });

    if (!existinguser) {
        return  Response.json(
            {
                message: "User does'nt exists",
                status: 400,
                contentType: "application/json"
            })
    }

    // if admin

    const issuedAt =  new Date();
      const expiresIn = 3600; // 1 hour in seconds
      const expiresAt = new Date(issuedAt.getTime() + expiresIn * 1000);
      console.log("expire time", expiresAt);

      const token = await jwt.sign(
        { email: existinguser.email, issuedAt, expiresAt },
        process.env.secret,
        { expiresIn: expiresIn }
      );

      // Store the token and related information in the user document
      existinguser.resetToken = token;
      existinguser.resetTokenIssuedAt = issuedAt;
      existinguser.resetTokenExpiresAt = expiresAt;
      await existinguser.save();

    return Response.json({ User:existinguser, message: "User already exists" ,
            status: 200, 
            contentType : "application/json"
        }); 
}

