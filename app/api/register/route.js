
import  connectDB  from '../../middleware/connectDB';
import user from '../../models/usermodel'

export async function POST (req, res){
  
    try {
        await connectDB();
        const {name,email,password,phone} = await req.json();
        // console.log(data);
      console.log("yes");

      let dummy = new user({
        name,
        email,
        password,
        phone

      });

      const result = await dummy.save();

      console.log("data saved in database", result);
        return Response.json({ status: "successfull", result });
        
    } catch (error) {
      console.log(error);
      return Response.json({ msg: "eroor occurred", error: error.message });
    }
  }  
 
export function GET (req, res) {
    
    return Response.json({ msg: "this method is not allowed here" });

  }

 

 
