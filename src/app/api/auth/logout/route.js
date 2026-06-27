import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true,
    });

    // Clear the httpOnly cookie properly
    response.cookies.set("ecom_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0), // Set to epoch to expire immediately
      maxAge: 0, // Also set maxAge to 0
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
