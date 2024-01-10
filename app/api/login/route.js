import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";

export async function POST(req, res) {
  try {
    await connectDB();
    const { name, email, password, ip, location } = await req.json();
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
    //   if(check) console.log(check,"hey betu");
    // console.log("final user look like", existingUser);

    if (existingUser.isOwner) {
      return Response.json(
        {
          message: "Owner Validation Successful",
          user: existingUser,
        },
        { status: 200 },
      );
    }

    if (existingUser.isAdmin)
      return Response.json(
        {
          message: "Admin Validation Successful",
          user: existingUser,
        },
        { status: 200 },
      );

    return Response.json({
      message: "no method for this request",
      user: existingUser,
    }, {status:404});
  } catch (error) {
    console.log("error at login api", error);
    return Response.json({ message: "error", error: error.message },{status:400});
  }
}

export function GET(req, Response) {
  return Response.json({ message: "This method is not allowed here" },{status:400});
}
