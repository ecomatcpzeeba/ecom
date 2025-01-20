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

      // Get the user's IP address
      const ip = request.headers.get("x-forwarded-for") || request.ip

      // Log the IP address for debugging
      console.log("IP Address: ", ip)

      // Skip geolocation check for localhost or loopback addresses
      if (ip === "0:0:0:0:0:0:0:1" || ip === "127.0.0.1" || ip === "::1") {
        console.log(
          "Access from localhost or loopback, skipping geolocation check."
        )
        return true // Allow localhost access without geolocation check
      }

      // Geolocation API Check
      const geoLocationAPI = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEOLOCATION}`

      try {
        const res = await fetch(`${geoLocationAPI}&ip=${ip}`)
        const location = await res.json()

        // Allow only users from Chennai, Tamil Nadu, India
        if (
          location.city !== "Chennai" ||
          location.state_prov !== "Tamil Nadu" ||
          location.country_name !== "India"
        ) {
          console.log("Blocked access from:", location)
          return false // Blocked access
        }
      } catch (error) {
        console.error("Geolocation API Error:", error)
        return false // Block access on API failure
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
