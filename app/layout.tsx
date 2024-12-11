import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header/Header1'
import Providers from '@/components/Providers'
import DrawerButton from '@/components/DrawerButton'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CPZeeba',
  description: 'Modern Ecommerce Website',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/icons/icon-96x96.png',
    apple: '/icons/icon-192x192.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icons/icon-152x152.png',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="drawer">
            <DrawerButton />
            <div className="drawer-content">
              <div className="min-h-screen flex flex-col">
                <Header />
                {children}
                <Footer />
              </div>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
