'use client'
import { OrderItem } from '@/lib/models/OrderModel'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import Script from 'next/script'
import useSWRMutation from 'swr/mutation'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()

      res.ok
        ? toast.success('Order delivered successfully')
        : toast.error(data.message)
    }
  )

  async function handleRazorpayPaymentGateway(
    paymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ) {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpayOrderId,
          razorpayPaymentId: paymentId,
          razorpaySignature,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Payment verification failed.')
      }

      const result = await response.json()
      console.log('result', result)
      toast.success('Payment verified successfully!')
      router.push(`/order/${result._id}`) // Redirect to order details after success
    } catch (error) {
      console.error('Razorpay payment verification error:', error)
      toast.error('Payment verification failed.')
    } finally {
      setIsLoading(false)
    }
  }

  // Razorpay Payment Methods
  async function handleRazorpayPayment() {
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/orders/${orderId}/create-razorpay-order`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET}`
            ).toString('base64')}`,
          },
          body: JSON.stringify({ amount: totalPrice, orderId }),
        }
      )
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`)
        const errorText = await response.text() // Log raw response text
        throw new Error(`API error: ${errorText}`)
      }

      // Parse the JSON only if the response body exists
      const responseBody = await response.text()
      console.log(responseBody)
      if (responseBody) {
        const { id, receipt, amount, currency } = JSON.parse(responseBody)
        console.log('Parsed JSON:', { id, receipt, amount, currency })
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          order_id: id,
          prefill: {
            email: session?.user?.email,
          },

          notes: {
            receipt: 'orderId',
          },
          handler: async (response: any) => {
            await handleRazorpayPaymentGateway(
              response.razorpay_payment_id,
              id,
              response.razorpay_signature
            )
          },
        }

        const razorpayInstance = new window.Razorpay(options)
        razorpayInstance.open()
      } else {
        throw new Error('Empty response body received from API.')
      }
    } catch (error) {
      console.error('Payment Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order)
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success('Order paid successfully')
      })
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`)

  if (error) return error.messsage
  if (!data) return 'Loading...'

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data

  return (
    <div>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}&merchant-id=${process.env.MERCHANT_ID}`}
      ></Script>
      {/* Razorpay Checkout Script (Global) */}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <h1 className="text-2xl py-4">Order {orderId}</h1>
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 sm:grid-cols-1 xs:grid-cols-1 xxs:grid-cols-1 md:gap-5 m-4">
        <div className="md:col-span-2 col-span-3 lg:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode},{shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className="text-success">Delivered At {deliveredAt}</div>
              ) : (
                <div className="text-error">Not Delivered</div>
              )}
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <p>{paymentMethod}</p>

              {isPaid ? (
                <div className="text-success">Paid at {paidAt}</div>
              ) : (
                <div className="text-error">Not Paid</div>
              )}
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item._id}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">
                            {item.name} ({item.color} {item.sizes})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-1 col-span-1 xxs:mt-4 xs:mt-4 sm:mt-4 lg:ml-3 xl:ml-3 ml-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>₹{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>₹{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>₹{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>₹{totalPrice}</div>
                  </div>
                </li>
                {!isPaid && paymentMethod === 'PayPal' && (
                  <li>
                    <PayPalScriptProvider
                      options={{ clientId: paypalClientId }}
                    >
                      <PayPalButtons
                        createOrder={createPayPalOrder}
                        onApprove={onApprovePayPalOrder}
                      />
                    </PayPalScriptProvider>
                  </li>
                )}

                {!isPaid && paymentMethod === 'Razorpay' && (
                  <div className="mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={handleRazorpayPayment}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : `Pay ₹${totalPrice}`}
                    </button>
                  </div>
                )}

                {session?.user.isAdmin && (
                  <li>
                    <button
                      className="btn w-full my-2"
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                    >
                      {isDelivering && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Mark as delivered
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
