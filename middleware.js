import { NextResponse } from "next/server";

// Define the matcher for admin routes, home page, and signup page
export const config = {
  matcher: ["/admin/:path*", "/", "/signup"],
};

export function middleware(req) {
  // Get the cookies from the request
  let cookies = req.cookies;

  // Access the "auth" cookie
  let authCookie = cookies.get("auth");

  console.log("cookie is",authCookie);

  // Determine if the user is on the home page (login page)
  const isHomePage = req.nextUrl.pathname === "/";

  // Determine if the user is trying to access an admin route
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin/");

  // Determine if the user is trying to access the signup page
  const isSignupPage = req.nextUrl.pathname === "/signup";

  // If the user is new and not visiting any admin route, allow them to proceed
  if (isHomePage && !isAdminRoute && !authCookie) {
    return NextResponse.next();
  }

  // If the user is trying to visit an admin route, check for the auth cookie
  if (isAdminRoute && !authCookie) {
    // If the auth cookie is missing, redirect to the home page (login page)
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is logged in and trying to visit the admin page, allow them to proceed
  if (isAdminRoute && authCookie) {
    return NextResponse.next();
  }

  // If the user is logged in and trying to visit the home (login) or signup page, redirect to the admin page
  if ((isHomePage || isSignupPage) && authCookie) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // For all other cases, allow the user to proceed
  return NextResponse.next();
}
