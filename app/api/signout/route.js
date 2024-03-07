// pages/api/signout.js

import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(req) {
    // Clear the auth cookie by setting its maxAge to -1
    
    try {
      
        // console.log("Coockie is", clearedCookie);
        // Create a response and set the cleared cookie
        const response = new NextResponse(null, {
          status: 200,
          headers: {
            'Set-Cookie' : [
      'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict',
    ],
          },
        });

        // Send the response back to the client
        return response;
    } catch (error) {
        console.log(error);
        return Response.json({ message: error.message },{status:400});

    }

  
}



/*

// Example frontend code for a sign-out button

// Function to call the sign-out API
async function signOut() {
  try {
    const response = await fetch('/api/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Necessary to include cookies in the request
    });

    if (response.ok) {
      console.log('Signed out successfully');
      // Redirect to the home page or perform other actions after sign out
      // window.location.href = '/';
    } else {
      console.error('Failed to sign out');
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

// Add event listener to the sign-out button
document.getElementById('sign-out-button').addEventListener('click', signOut);


*/