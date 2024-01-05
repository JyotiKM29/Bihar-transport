import user from '../../models/usermodel'
import connectDB from '../../middleware/connectDB'


export async function POST (req,res){


    try {
    
    await connectDB()
    const { email, password } = await req.json();
    console.log(email, password);
    
    // check for existing user with the same email 
        const existingUser = await user.findOne({ email });

        console.log("admin",existingUser);

       if(existingUser===null){
        return Response.json({ msg: "you're not allowed" });
        }
        

        // password failed
        if (existingUser.password !== password) {
            return Response.json({ msg: "password does'nt match" });
        }

        // if user but not admin 
    if(!existingUser.isAdmin){
        return Responses.json({ msg: "ask owner to assign you as admin role" });
        }
        

        if(existingUser.isOwner){
              return Responses.json({ msg:"Thank you for visiting owner", user:existingUser });
        }

        return Response.json({msg:"welcome Admin", user:existingUser});
 
  
    } catch (error) {
        console.log("error at login api", error);
        return Response.json({msg:"error", error:error.message});
    }
  
}

export function GET (req, res){
  return Response.json({ msg: "This method is not allowed here" });
};
