
const access_token = process.env.access_token;

export async function GET (req, context){
    return Response.json({msg : "Testing"});
    
}


