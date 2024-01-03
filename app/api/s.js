import connectDB from '../middleware/connectDB';
import user from '../models/usermodel'



const handler = async (req, res) => {
    
    
    if (req.method === 'POST') {
        
        try {
            const { name } = req.body;
            console.log("yes");

            let dummy = new userAgent({
                name,
            });

            const result = await dummy.save();

            console.log("data saved in database", result);
            res.status(200).json({ status: "successfull", result });

        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "eroor occurred", error: error.message });
     }

       



    }
    else {
        res.status(400).json({ msg: "this method is not allowed here" });
    }




}


export default connectDB(handler);