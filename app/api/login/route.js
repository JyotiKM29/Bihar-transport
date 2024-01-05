import user from '../../models/usermodel'
import connectDB from '../../middleware/connectDB'


export async function POST (req,res){


    await connectDB()
    .then(()=>{
        console.log("db connected");
    })

    .catch((err)=>{
        console.log('error',err);
    })

    Response.json({msg:"cool"});



}