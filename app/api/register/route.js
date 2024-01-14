
import  connectDB  from '../../middleware/connectDB';
import user from '../../models/usermodel'
import { headers } from 'next/headers'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
export const dynamic = 'force-dynamic' // defaults to auto


export async function POST (req, res){
  
    try {
        await connectDB();
        const {name,email,password,phone} = await req.json();
        // console.log(data);
      console.log("yes");


      const User = await user.findOne({ email });

      if (User) {
        return Response.json({
            message: "user already exists, please login", },{status: 404});
      }


       const issuedAt = new Date();
       const expiresIn = 3600; // 1 hour in seconds
       const expiresAt = new Date(issuedAt.getTime() + expiresIn * 1000);
       console.log("expire time", expiresAt);

       const token = jwt.sign(
         { email: email, issuedAt, expiresAt },
         process.env.secret,
         { expiresIn: expiresIn },
      );
      

      let dummy = new user({
        name,
        email,
        password,
        phone,
        emailToken: token,
        emailTokenIssuedAt: issuedAt,
        emailTokenExpiresAt:expiresAt
      });

      const result = await dummy.save();


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
         from: '"Suraj Pandey from Bihar Transport 👻" <surajjbhardwaj@gmail.com>', // sender address
         to: result.email, // list of receivers
         subject: "Forget Password Email ✔", // Subject line
         text: "", // plain text body
         html: `<p>Hello ${result.name} </p> <p> here is your link to verify the email </p> https://bihar-transport.vercel.app/emailVerify/${result.emailToken} `, // html body
       });

       console.log("Message sent: %s", info.messageId);




      console.log("data saved in database", result);
      return Response.json(
        {
          message: "user added successfully",
          URL: `https:/https://bihar-transport.vercel.app///api/emailvrification/${result.emailToken}`,
          user: dummy,
        },
        { status: 200 },
      );
        
    } catch (error) {
      console.log(error);   
      return Response.json(
        { message: error.message},
        { status: 400 },
      );

      // return Response.json({msg: "error occurred while signup", error: error.message });
    }
  }  
 
export async function GET (requst) {
    
  return Response.json({ message: "This method is not allowed here" }, { status: 400 });


  }

 

 
