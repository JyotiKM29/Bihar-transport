
import  connectDB  from '../../middleware/connectDB';
import user from '../../models/usermodel'

export async function POST (req, res){
  
    try {
        await connectDB();
        const {name,email,password,phone} = await req.json();
        // console.log(data);
      console.log("yes");


      const User = await user.findOne({ email });

      if (User) {
        return Response.json({
          msg: "failed",
          status:404,
          message: "user already exists, please login"
        });
      }


      let dummy = new user({
        name,
        email,
        password,
        phone
      });

      const result = await dummy.save();

      console.log("data saved in database", result);
        return Response.json({ status:"ok",message: "user added successfully", user:dummy });
        
    } catch (error) {
      console.log(error);
      return Response.json({msg: "error occurred while signup", error: error.message });
    }
  }  
 
export function GET (req, res) {
    
    return Response.json({ msg: "this method is not allowed here" });

  }

 

 
