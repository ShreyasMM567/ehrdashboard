import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, token: any) => Promise<NextResponse>
) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || 'JWT-secret' 
    })

    console.log("🛡️ Auth middleware check for:", request.url)
    console.log("🛡️ Token found:", token ? {
      id: token.id,
      email: token.email,
      name: token.name,
      exp: token.exp
    } : "No token")

    if (!token) {
      console.log("❌ Unauthorized - No valid session")
      return NextResponse.json(
        { error: "Unauthorized - No valid session" },
        { status: 401 }
      )
    }

    console.log("✅ Authorized request proceeding")
    return await handler(request, token)
  } catch (error) {
    console.error("❌ Auth middleware error:", error)
    return NextResponse.json(
      { error: "Unauthorized - Invalid session" },
      { status: 401 }
    )
  }
}

export function createAuthenticatedHandler(
  handler: (request: NextRequest, token: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    return withAuth(request, handler)
  }
}
