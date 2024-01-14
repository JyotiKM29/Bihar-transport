import user from "../../../models/usermodel";
import connectDB from "../../../middleware/connectDB";

export async function GET(req, context) {
  try {
    const { params } = context;

    console.log(params.token);

      // return Response.json("your email is verified");
      await connectDB();

    const User = await user.findOne({ emailToken: params.token });

    if (User) {
      console.log("User");

      if (User.emailTokenExpiresAt < new Date()) {
        //  console.log(error);
        return Response.json(
          { message: "Token Expired, Please try Again" },
          { status: 400 },
        );
      } else {
        console.log("hey");
        User.isemailVerified = true;
        User.emailTokenExpiresAt = new Date();

        await User.save();
        return Response.json(
          {
            message: "Email Verified",
            User,
          },
          { status: 200 },
        );
      }
    } else {
      return Response.json({ message: "user not found" }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
