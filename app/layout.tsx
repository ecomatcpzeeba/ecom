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

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CPZeeba',
  description: 'Modern Ecommerce Website',
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
                <footer className="left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
                  <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2024{' '}
                    <Link href="/" className="hover:underline">
                      Cpzeeba
                    </Link>
                    . All Rights Reserved.
                  </span>
                  <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                      <Link
                        href="/cancellation-and-refund"
                        className="hover:underline me-4 md:me-6"
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms-and-conditions"
                        className="hover:underline me-4 md:me-6"
                      >
                        Terms and Condition
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/cancellation-and-refund"
                        className="hover:underline me-4 md:me-6"
                      >
                        Cancellation and Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shipping-delivery-policy"
                        className="hover:underline me-4 md:me-6"
                      >
                        Shipping and Delivery Policy
                      </Link>
                    </li>
                  </ul>
                </footer>
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
