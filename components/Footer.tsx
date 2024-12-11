import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between dark:bg-gray-800 dark:border-gray-600">
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
  )
}
