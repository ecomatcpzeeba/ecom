import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import ProductModel from '@/lib/models/ProductModel'
import crypto from 'crypto'

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
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        await req.json()

      // Verify the Razorpay signature
      const generatedSignature = crypto
        .createHmac(
          'sha256',
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET as string
        )
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex')

      if (generatedSignature !== razorpaySignature) {
        return Response.json(
          { message: 'Invalid signature' },
          {
            status: 400,
          }
        )
      }

      // Update the order in the database as paid
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: razorpayPaymentId,
        status: 'paid',
        signature: razorpaySignature,
      }

      const updatedOrder = await order.save()

      return Response.json(updatedOrder)
    } catch (err: any) {
      console.error('Error verifying Razorpay payment:', err.message)
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
