
const access_token = process.env.access_token;

export async function GET (req){
    return Response.json({msg : "Testing"});
}


