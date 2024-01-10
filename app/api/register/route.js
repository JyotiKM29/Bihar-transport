
import  connectDB  from '../../middleware/connectDB';
import user from '../../models/usermodel'
import { headers } from 'next/headers'
 export const dynamic = 'force-dynamic' // defaults to auto

export async function POST (req, res){
  
    try {
        await connectDB();
        const {name,email,password,phone} = await req.json();
        // console.log(data);
      console.log("yes");


      const User = await user.findOne({ email });

      if (User) {
        return Response.json(
          {
            msg: "failed",
            message: "user already exists, please login",
          },
          {
            status: 404,
          },
        );
      }


      let dummy = new user({
        name,
        email,
        password,
        phone
      });

      const result = await dummy.save();

      console.log("data saved in database", result);
      return Response.json({ message: "user added successfully", user: dummy },{status:200});
        
    } catch (error) {
      console.log(error);   
      return Response.json(
        { message: error.message},
        { status: 400 },
      );

      // return Response.json({msg: "error occurred while signup", error: error.message });
    }
  }  
 
export async function GET (requst) {
    
  return Response.json({ message: "This method is not allowed here" }, { status: 400 });


  }

 

 
