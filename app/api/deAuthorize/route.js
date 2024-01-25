import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";
import { NextResponse } from "next/server";

export async function DELETE(req, res) {
  try {
    await connectDB();
    const { _id, id } = await req.json();

    const owner = await user.findOne({ _id });

    if (!owner) {
      return Response.json(
        {
          message: "not found",
        },
        {
          status: 400,
        },
      );
    }

    if (!owner.isOwner) {
      return Response.json({
        message: "You're not allowed to authorize anyone",
        status: 400,
        contentType: "application/json",
      });
    }

    // if admin

    const Admin = await user.findByIdAndDelete(id); 

      return Response.json({ msg: "Successfully Deleted", Admin, status: 200 });
    }
   catch (error) {
    console.log("error at forget password api route", error);
    return Response.json({ msg: error.message, status: 404 });
  }
}

export function GET(req) {
  return Response.json({ msg: "this method is not allowed", status: 400 });
}
