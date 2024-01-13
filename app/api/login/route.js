import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import { serialize } from 'cookie';
import { NextRequest } from "next/server";
import { FaBullseye } from "react-icons/fa";


export async function POST(request,response) {
  try {
    await connectDB();
    const { name, email, password, ip, location } = await request.json();
    // console.log(email, password, ip, location);

    // Check for existing user with the same email
    const existingUser = await user.findOne({ email });

    // console.log("admin", existingUser);

    if (!existingUser) {
      return Response.json({ message: "user does not exist" }, { status: 400 });
    }

    // Password failed
    if (existingUser.password !== password) {
      return Response.json(
        { message: "password doesn't match" },
        { status: 400 },
      );
    }

    // If user but not admin
    if (!existingUser.isAdmin) {
      return Response.json(
        { message: "ask owner to assign you as admin role" },
        { status: 400 },
      );
    }

    // Success cases
    if (!Array.isArray(existingUser.loginHistory)) {
      existingUser.loginHistory = [];
      console.log("hey");
    }

    // Append the new login history entry
    existingUser.loginHistory.push({ ip, location });

    // Save the changes
    const check = await existingUser.save();

    const userId = check._id; // Example user ID
const username = check.name; // Example username
const role=check.IsOwner? "owner" : "admin"; // Example role
    const userDetails = `userId=${userId}&username=${username}&role=${role}`;
    
    // setting cookie to set the header
const cookie = serialize("auth", userDetails, {
  httpOnly: true,
  secure: true, // Ensure the cookie is sent over HTTPS
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
});





    // const cookie = serialize("auth", check._id, {
    //   httpOnly: true,
    //   // secure: process.env.NODE_ENV !== "development",
    //   secure: false,
    //   maxAge: 60 * 60 * 24 * 7, // 1 week
    //   path: "/",
    // });

    console.log(cookie);

   

    if (existingUser.isOwner) {
      return Response.json(
        {
          message: "Owner Validation Successful",
          user: check,
        },
        {
          status: 200,
          headers: {
            "Set-Cookie":cookie,
          },
        },
      );
    }

    if (existingUser.isAdmin)
      return Response.json(
        {
          message: "Admin Validation Successful",
          user: existingUser,
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": cookie,
          },
        },
      );

    return Response.json(
      {
        message: "no method for this request",
        user: existingUser,
      },
      { status: 404 },
    );
  } catch (error) {
    console.log("error at login api", error);
    return Response.json({ message: "error", error: error.message },{status:400});
  }
}

export function GET(req, Response) {
  return Response.json({ message: "This method is not allowed here" },{status:400});
}

