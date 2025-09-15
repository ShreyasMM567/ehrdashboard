import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

// Fixed credentials for login
const FIXED_USERNAME = "admin@admin.com"
const FIXED_PASSWORD = "password123"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Authentication attempt with credentials:", {
          email: credentials?.email,
          password: credentials?.password ? "***" : "undefined"
        })

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials")
          return null
        }

        // For signup, always allow (you can add validation here)
        // For login, check against fixed credentials
        if (credentials.email === FIXED_USERNAME && credentials.password === FIXED_PASSWORD) {
          const user = {
            id: "1",
            email: credentials.email,
            name: "Admin User",
          }
          console.log("✅ Admin login successful:", user)
          return user
        }

        // For signup, create a new user (in a real app, you'd save to database)
        if (credentials.email !== FIXED_USERNAME) {
          const user = {
            id: Date.now().toString(),
            email: credentials.email,
            name: credentials.email.split('@')[0],
          }
          console.log("✅ New user signup successful:", user)
          return user
        }

        console.log("❌ Invalid credentials")
        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        console.log("🔑 Creating JWT token for user:", user)
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      console.log("🔑 JWT token:", {
        id: token.id,
        email: token.email,
        name: token.name,
        exp: token.exp,
        iat: token.iat
      })
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
      }
      console.log("📋 Session created:", {
        user: session.user,
        expires: session.expires
      })
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'JWT-secret',
}
