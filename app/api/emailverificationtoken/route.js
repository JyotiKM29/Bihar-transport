import user from "../../models/usermodel";
import jwt from "jsonwebtoken";
import connectDB from "../../middleware/connectDB";
import nodemailer from "nodemailer";

export async function POST(req, res) {
  try {
    const { email } = await req.json();

    // return Response.json("your email is verified");
    await connectDB();

    const User = await user.findOne({ email });

    if (User) {
      if (User.isemailVerified) {
        return Response.json(
          {
            message: "Already Verified",
            User,
          },
          { status: 400 },
        );
      }
      console.log("User");
      const issuedAt = new Date();
      const expiresIn = 3600; // 1 hour in seconds
      const expiresAt = new Date(issuedAt.getTime() + expiresIn * 1000);
      console.log("expire time", expiresAt);

      const token = jwt.sign(
        { email: email, issuedAt, expiresAt },
        process.env.secret,
        { expiresIn: expiresIn },
      );

      User.emailToken = token;
      user.emailTokenIssuedAt = issuedAt;
      User.emailTokenExpiresAt = expiresAt;

      await User.save();

      // email user

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"suraj from Bihar Transport",${process.env.user}`,
        to: User.email,
        subject: "Regarding Email Verification",
        html: `<p>Dear ${User.name}</p> <p>Click on this link to verify your email</p> https://bihar-transport.vercel.app/emailverification/${User.emailToken}`,
      });

      console.log("Message sent: %s", info.messageId);
      return Response.json(
        {
          message: "Verification Email sent to your email",
          token: User.emailToken,
        },
        { status: 200 },
      );
    } else {
      return Response.json({ message: "user not found" }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}



export function GET(req, res) {
    return Response.json({message:"method not allowed"},{status:400})
}