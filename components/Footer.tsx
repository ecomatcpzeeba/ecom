import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 shadow dark:bg-gray-800 dark:border-gray-600">
      {/* Grid Container */}

      <div className="grid grid-cols-4 xl:grid-cols-4 xxl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-1 xxs:grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        <div>
          <h2 className="text-2xl p-1 font-bold">QUICK LINKS</h2>
          <ul className="text-sm font-medium text-gray-500 dark:text-gray-400">
            <li>
              <Link
                href="/search?category=Leggings"
                className="hover:underline"
              >
                Leggings
              </Link>
            </li>
            <li>
              <Link
                href="/search?category=Patiyala"
                className="hover:underline"
              >
                Patiyala
              </Link>
            </li>
            <li>
              <Link
                href="/search?category=Prayer%20Hijab"
                className="hover:underline"
              >
                Prayer Hijab
              </Link>
            </li>
          </ul>
        </div>
        {/* Address Section */}
        <div>
          <h2 className="text-2xl p-1 font-bold">ADDRESS</h2>
          <br />
          <ul className="text-gray-500 dark:text-gray-400">
            <li>Chennai Plaza</li>
            <li>Bharathi Salai</li>
            <li>Police Quarters</li>
            <li>Triplicane</li>
            <li>Chennai - 600014</li>
            <li>Tamil Nadu</li>
          </ul>
        </div>
        {/* Links Section */}
        <div>
          <h2 className="text-2xl p-1 font-bold">INFORMATION</h2>
          <ul className="text-sm font-medium text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/cancellation-and-refund" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:underline">
                Terms and Condition
              </Link>
            </li>
            <li>
              <Link href="/cancellation-and-refund" className="hover:underline">
                Cancellation and Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/shipping-delivery-policy"
                className="hover:underline"
              >
                Shipping and Delivery Policy
              </Link>
            </li>
          </ul>
        </div>
        {/* Map Section */}
        <div className="flex justify-center items-center">
          <div>
            <h2 className="text-2xl p-1 font-bold">GOOGLE MAP LOCATION</h2>
            <br />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62194.68236064546!2d80.23468377135369!3d13.024993844156292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52689fe1097c89%3A0xc2c31de505a79976!2sChennai%20Plaza!5e0!3m2!1sen!2sin!4v1733982492354!5m2!1sen!2sin"
              width="320"
              height="200"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: '0' }}
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        © 2024{' '}
        <Link href="/" className="hover:underline">
          Cpzeeba
        </Link>
        . All Rights Reserved.
      </div>
    </footer>
  )
}
