import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import { NextResponse } from "next/server";


export async function POST(req, res) {
  try {
    await connectDB();
    const { _id,id } = await req.json();

    const owner = await user.findOne({ _id });

      if (!owner.isOwner || owner.isAdmin) {
          console.log("cool",owner);
      return Response.json({
        message: "You're not allowed here",
        status: 400,
        contentType: "application/json",
      });
      }
      

      if ((owner.isAdmin) & (!owner.isOwner)) {
        return Response.json({
          message: "You're not allowed to authorize anyone",
          status: 400,
          contentType: "application/json",
        });   
      }

    // if admin

      const Admin = await user.findOne({ _id: id });
      if (!Admin) {
           return Response.json({
          message: "User does not exist",
          status: 400,
          contentType: "application/json",
        }); 
      }


      if (Admin.isAdmin) {
           return Response.json({
          message: "Already an admin",
          status: 400,
          contentType: "application/json",
        }); 

          
      }

      if(owner.isOwner && !Admin.isAdmin){

          Admin.isAdmin = true;
          

          if (!Array.isArray(Admin.adminDetails)) {
            Admin.adminDetails = [];
            console.log("hey");
          }

          // Append the new login history entry
          Admin.adminDetails.push({ assignedBy: owner.name });
          await Admin.save();

          return Response.json({ msg: "Admin Authorized", Admin, status: 200 });
          
      }

  } catch (error) {
    console.log("error at forget password api route", error);
    return Response.json({ msg: error.message, status: 404 });
  }
}

export function GET(req) {
  return Response.json({ msg: "this method is not allowed", status: 400 });
}
