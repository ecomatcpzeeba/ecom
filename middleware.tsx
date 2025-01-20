import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

const authConfig = {
  providers: [],
  callbacks: {
    async authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ]

      const { pathname } = request.nextUrl

      // Check if the path is protected
      if (protectedPaths.some((p) => p.test(pathname)) && !auth) {
        return false // Unauthorized access
      }

      return true // Authorized access
    },
  },
} satisfies NextAuthConfig

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
