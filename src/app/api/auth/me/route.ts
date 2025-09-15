import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here' 
    })

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: token.id,
        email: token.email,
        name: token.name,
      },
      authenticated: true
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { error: "Unauthorized - Invalid session" },
      { status: 401 }
    )
  }
}
