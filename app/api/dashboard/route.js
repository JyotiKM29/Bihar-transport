import connectDB from '../../middleware/connectDB'
import user from '../../models/usermodel'

export async function POST(req, res){
    
    try {
        await connectDB();

        const { id } = await req.json();

        const owner = user.findOne({ "_id": id });
        if (! owner.isOwner) {
          return Response.json({
              status:"failure",
              msg: "you're not allowed to visit here",
            });
        }

        const totaluser = await user.find();
        return Response.json({status:"ok", totaluser: totaluser.length, user: totaluser });

    } catch (error) {
        console.log(error);
        return Response.json({
          status: "failure",
          msg: "error",
          error: error.message,
        });
    }

}

 
export function GET(req, res) {
  return Response.json({ msg: "this method is not allowed here" });
}
