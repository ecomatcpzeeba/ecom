import { SessionProvider } from 'next-auth/react'
import { auth } from '../lib/auth'
import ClientProviders from './ClientProviders'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth() //returns result of auth and store in session variable

  return (
    <SessionProvider session={session}>
      <ClientProviders>{children}</ClientProviders>
    </SessionProvider>
  )
}
