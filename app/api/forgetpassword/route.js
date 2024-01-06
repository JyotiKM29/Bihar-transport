import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    
    await connectDB();
    const { email,password,newpassword } = await req.json();

    const existinguser = await user.findOne({email });

    if (!existinguser) {
        return  Response.json(
            {
                message: "User does'nt exists",
                status: 400,
                contentType: "application/json"
            })
    }

    // if user

    

    return Response.json({ User:existinguser, message: "User already exists" ,
            status: 200, 
            contentType : "application/json"
        }); 
}

