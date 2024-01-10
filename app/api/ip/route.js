// import { Response } from "next/server";



export async function GET(req, res) {

try{
  
        const token = process.env.ipToken;
        console.log(token);
        let data = await fetch(`https://ipinfo.io?token=${token}`);

        data = await data.json();
    console.log(data);
    // sadkhad


        return Response.json({ data }, { status: 200 });

    } catch (error) {
        return Response.json({message: "Failed to fetch"},{status:400});
    }




}