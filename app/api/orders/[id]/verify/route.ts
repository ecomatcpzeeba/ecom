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

      // Reduce stock for each item in the order
      for (const item of order.items) {
        const product = await ProductModel.findById(item.product)
        if (product) {
          const sizeIndex = product.size.findIndex(
            (s: { size: string; countInStock: number }) => s.size === item.size
          )
          if (sizeIndex !== -1) {
            if (product.size[sizeIndex].countInStock >= item.qty) {
              product.size[sizeIndex].countInStock -= item.qty
            } else {
              throw new Error(
                `Insufficient stock for size ${item.size} of product ${product.name}`
              )
            }
          } else {
            throw new Error(
              `Size ${item.size} not found for product ${product.name}`
            )
          }
          await product.save()
        } else {
          throw new Error(`Product with ID ${item.product} not found`)
        }
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
