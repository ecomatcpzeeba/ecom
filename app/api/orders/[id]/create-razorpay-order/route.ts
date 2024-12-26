import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import Razorpay from 'razorpay'

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET as string,
})

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request

  // Check if user is authenticated
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  await dbConnect() // Connect to the database

  // Fetch the order from the database
  const order = await OrderModel.findById(params.id)
  if (order) {
    try {
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: order.totalPrice * 100, // Amount in paise
        currency: 'INR', // Currency code
        receipt: `order_${order._id}`, // Unique receipt ID
      })

      // Return the created Razorpay order
      return Response.json(razorpayOrder)
    } catch (err: any) {
      console.error('Razorpay order creation error:', err.message)
      return Response.json(
        { message: err.message },
        {
          status: 500,
        }
      )
    }
  } else {
    // If the order is not found in the database
    return Response.json(
      { message: 'Order not found' },
      {
        status: 404,
      }
    )
  }
}) as any
