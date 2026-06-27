import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("ecom_token")?.value;
  const { pathname } = req.nextUrl;

  // 1. Agar token maujood hai aur user public pages ya login par jaane ki koshish kare
  if (
    token &&
    (pathname === "/login" || pathname === "/register" || pathname === "/")
  ) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Role check karke absolute isolation zone mein bhejenge
      if (payload.role === "vendor") {
        return NextResponse.redirect(new URL("/vendor", req.url));
      }
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } catch (err) {
      // Invalid token ho toh clear karke login par bhej do
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("ecom_token");
      return response;
    }
  }

  // 2. Protected Routes Guard (Vendor & Admin Routes Security Check)
  if (pathname.startsWith("/vendor") || pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      if (pathname.startsWith("/vendor") && payload.role !== "vendor") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 3. Checkout Route Protection - Must be logged in
  if (pathname === "/checkout") {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Only regular users can checkout (not admin or vendor)
      if (payload.role === "admin" || payload.role === "vendor") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/vendor/:path*",
    "/admin/:path*",
    "/checkout",
  ],
};
