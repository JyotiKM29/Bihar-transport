"use Strict"

import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'


export async function POST(req, res) {
    try {
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


    if (!existinguser.isAdmin &  !existinguser.isOwner) {
         return Response.json({
           message: "Sorry but, we don't serve you... We only serve few specific persons",
           status: 400
         });
    }

    // if admin

    const issuedAt =  new Date();
      const expiresIn = 3600; // 1 hour in seconds
      const expiresAt = new Date(issuedAt.getTime() + expiresIn * 1000);
      console.log("expire time", expiresAt);

      const OTP = Math.floor(100000 + Math.random() * 900000);
      console.log("OTP", OTP);

      // Store the token and related information in the user document
      existinguser.resetToken = OTP;
      existinguser.resetTokenIssuedAt = issuedAt;
      existinguser.resetTokenExpiresAt = expiresAt;
      await existinguser.save();

      console.log(OTP);
      // emailreq

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.user,
          pass: process.env.pass,
        },
        });
      
    const info = await transporter.sendMail({
      from: '"Suraj Pandey from Bihar Transport" <surajjbhardwaj@gmail.com>', // sender address
      to: existinguser.email, // list of receivers
      subject: "Forget Password OTP for bihar Transport ✔", // Subject line
      text: "", // plain text body
      html: `<p>Hello ${existinguser.name} </p> <p> here is your OTP : ${existinguser.resetToken} </p> <p> Note: Otp will be valid for next 1 hours only. </p> `// html body
    });
 console.log(OTP);
  console.log("Message sent: %s", info.messageId);
      
    return Response.json({ User:existinguser, message: "Admin found" ,
            status: 200, 
            contentType : "application/json"
        }); 
    } catch (error) {
        console.log("error at forget password api route", error);
        return Response.json({ msg: error.message, status: 404 });
    }
  
}



export function GET(req) {
    return Response.json({ msg: "this method is not allowed", status: 400 });
}

