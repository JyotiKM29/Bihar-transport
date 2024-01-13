import { NextResponse } from "next/server";

// Define the matcher for admin routes
export const config = {
  matcher: [ "/admin/:path*", "/"]
};

export function middleware(req) {
  // Get the cookies from the request
  const cookies = req.cookies;

  // Access the "auth" cookie
    const authCookie = cookies.get("auth");
    
    console.log("middleware", authCookie);
 

//   // Parse the user details from the cookie
//   const userDetails = authCookie
//     ? Object.fromEntries(new URLSearchParams(authCookie))
//         : {};
    
    // console.log("middleware user",userDetails);
    // Check if the user is authenticated (auth cookie contains user details)
    
    // console.log("middleware", isAuthenticated);
    // If the user is not authenticated, redirect to the home page
    
    const isHomePage = req.nextUrl.pathname === "/";
       
  if (isHomePage && !authCookie) {
    return NextResponse.next();
  }

     // If the user is at the home page and has an auth cookie, redirect to the /admin route
     if (isHomePage && authCookie) {
       return NextResponse.redirect(new URL("/admin", req.url));
     }



  if (!authCookie) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is authenticated, allow them to proceed
  return NextResponse.next();
}
