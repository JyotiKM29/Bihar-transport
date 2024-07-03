import Map from "../../../../models/mapmodel";
import userModel from "../../../../models/usermodel";
import connectDB from "../../../../middleware/connectDB";
import { log } from 'console';


const refreshToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.ClientID);
    params.append("client_secret", process.env.ClientSecret);
    const result = await fetch(
      `https://outpost.mappls.com/api/security/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    const data = await result.json();
    // console.log("refresh data",data);
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Error refreshing token");
  }
};

export async function GET(req, context) {
  try {
    let { params } = context;
    // Replace spaces with %20 in the search query
    params.value = params.value.replace(/ /g, "%20");

    console.log(params);

    // console.log(params.value);
    await connectDB();

    const admin = await userModel.findOne({ _id: params.adminId });
    if (!admin || !admin.isAdmin && !admin.isOwner) {
      return Response.json({
        message:"Admin Not found",
      },{status:404});
    }

    const map = await Map.findOne();
    // console.log("map", map);
    let access_token;

    if (!map) {
      const data = await refreshToken();
      // log("data",data);
      const newMap = new Map({
        access_token : data,
      });

      // if (newMap.access_token === undefined) {
      //   throw new Error("Error refreshing token");
      // }
      
      await newMap.save();
      access_token = newMap.access_token.access_token;
    } else {
      access_token = map.access_token.access_token;
    }
    // console.log(access_token);

    async function fetchDataWithRetry(tries = 3) {
      console.log(tries,"checking");
      const result = await fetch(
        `https://atlas.mapmyindia.com/api/places/textsearch/json?query=${params.value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const data = await result.json();

      // console.log("heres is the response", data);

      if (data.error && data.error === "invalid_token" && tries > 0) {
        const newToken = await refreshToken();
        map.access_token = newToken;
        await map.save();
        access_token = newToken.access_token;

        // Retry the fetch with the new token and decrement the tries
        return fetchDataWithRetry(tries - 1);
      }

      return data;
    }

    const result = await fetchDataWithRetry();
    // console.log("response sent", result);

    return Response.json({ result }, { status: 200 });
      
  } catch (error) {
    console.error(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export function POST(req,res) {
  return Response.json({
    
    message: "this method is not allowed",
  },{
    status: 400, // Changed status to 200 for successful POST request
  });
}
