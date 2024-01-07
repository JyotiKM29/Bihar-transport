import user from "../../models/usermodel";
import connectDB from "../../middleware/connectDB";

export async function POST(req, res) {
  try {
    await connectDB();
    const { name, email, phone, password, ip, location } = await req.json();
    // console.log(email, password, ip, location);

    // Check for existing user with the same email
    const existingUser = await user.findOne({ email });

    // console.log("admin", existingUser);

    if (!existingUser) {
      return Response.json({ msg: "you're not allowed" });
    }

    // Password failed
    if (existingUser.password !== password) {
      return Response.json({ msg: "password doesn't match" });
    }

    // If user but not admin
    if (!existingUser.isAdmin) {
      return Response.json({ msg: "ask owner to assign you as admin role" });
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
      return Response.json({
        msg: "Thank you for visiting, sir",
        user: existingUser,
      });
    }

    return Response.json({ msg: "welcome Admin", user: existingUser });
  } catch (error) {
    console.log("error at login api", error);
    return Response.json({ msg: "error", error: error.message });
  }
}

export function GET(req, Response) {
  return Response.json({ msg: "This method is not allowed here" });
}
