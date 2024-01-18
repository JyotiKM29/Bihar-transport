// import { NextResponse } from "next/server";

// // Define the matcher for admin routes, home page, and signup page
// export const config = {
//   matcher: ["/admin/:path*", "/signup", "/forget-password/:path*"],
// };

// export async function middleware(req) {
//   // Get the cookies from the request
//   const forgetPage =
//     (await req.nextUrl.pathname.startsWith("/forget-password")) ||
//     req.nextUrl.pathname.startsWith("/forgetpassword");
//   console.log("hello");

//   let cookies = req.cookies;

//   // Access the "auth" cookie
//   let authCookie = await cookies.get("auth");

//   console.log("cookie is", authCookie);

//   // Determine if the user is on the home page (login page)
//   const isHomePage = (await req.nextUrl.pathname) === "/";

//   // Determine if the user is trying to access an admin route
//   const isAdminRoute = await req.nextUrl.pathname.startsWith("/admin/");

//   // Determine if the user is trying to access the signup page
//   const isSignupPage = (await req.nextUrl.pathname) === "/signup";
//   if (forgetPage) return NextResponse.next();
//   // If the user is new and not visiting any admin route, allow them to proceed
//   //  else if (isHomePage && !isAdminRoute && !authCookie) {
//   //    return NextResponse.next();
//   //  }
//   // // If the user is trying to visit an admin route, check for the auth cookie
//   // else if (isAdminRoute && !authCookie) {
//   //   // If the auth cookie is missing, redirect to the home page (login page)
//   //   return NextResponse.redirect(new URL("/", req.url));
//   // }
//   // // If the user is logged in and trying to visit the admin page, allow them to proceed
//   // else if (isAdminRoute && authCookie) {
//   //   return NextResponse.next();
//   // }
//   // // If the user is logged in and trying to visit the home (login) or signup page, redirect to the admin page
//   // else if ((isHomePage || isSignupPage) && authCookie) {
//   //   return NextResponse.redirect(new URL("/admin", req.url));
//   // }
//   // For all other cases, allow the user to proceed
//   else return NextResponse.next();
// }









// import { NextResponse } from "next/server";

// export function middleware(request) {
//   let authCookie = request.cookies.get("auth");

//   console.log(authCookie);
//   const response = NextResponse.next();
//   if (!authCookie) {
//     response.cookies.set("auth", "false");
//     if (
//       request.nextUrl.pathname === "/forget-password" ||
//       request.nextUrl.pathname === "/signup" ||
//       request.nextUrl.pathname === "/" ||
//       request.nextUrl.pathname === "/verify-email" ||
//       request.nextUrl.pathname.startsWith("/forget-password/...")
//     ) {
//       return NextResponse.next();
//     }



//     console.log("okay");
//   }
//   const newcookie = response.cookies.get("auth");

//   // return NextResponse.redirect(new URL("/", request.url));
// }


import { NextResponse } from "next/server";


export async function middleware(req) {
  const response = NextResponse.next();
  const authCookies = await req.cookies.get("auth");

  if (req.nextUrl.pathname.startsWith("/admin/") && authCookies) {
    return NextResponse.next();
  }

  if((req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/signup") && authCookies){
     return NextResponse.rewrite(new URL("/admin", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/admin/") && !authCookies) {
   return NextResponse.rewrite(new URL("/", req.url), {
     status: 303,
   });
  }


    return NextResponse.next();
  


}




// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   // Get the cookies from the request
//   let cookies = req.cookies;

//   // Access the "auth" cookie
//   let authCookie = await cookies.get("auth");

//   console.log("cookie is", authCookie);

//   // Determine if the user is on the home page (login page), trying to access an admin route, or trying to access the signup page
//   const [isHomePage, isAdminRoute, isSignupPage] = await Promise.all([
//     req.nextUrl.pathname === "/",
//     req.nextUrl.pathname.startsWith("/admin/"),
//     req.nextUrl.pathname === "/signup",
//   ]);

//   // Determine if the user is trying to access a forget password route
 

//   // If the user is new and not visiting any admin route, rewrite the URL to the home page
//   if (isHomePage && !isAdminRoute && !authCookie) {
//     return NextResponse.redirect(new URL("/admin", req.url));
//   }

//   // If the user is trying to visit an admin route, check for the auth cookie
//   if (isAdminRoute && !authCookie) {
//     // If the auth cookie is missing, redirect to the home page (login page)
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // If the user is logged in and trying to visit the admin page, rewrite the URL to the admin page
//   if (isAdminRoute && authCookie) {
//     return NextResponse.rewrite("/admin");
//   }

//   // If the user is logged in and trying to visit the home (login) or signup page, redirect to the admin page
//   if ((isHomePage || isSignupPage) && authCookie) {
//     return NextResponse.redirect(new URL("/admin", req.url));
//   }

//   // For all other cases, allow the user to proceed
//   return NextResponse.next();
// }
