import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }
  await dbConnect()

  const product = await ProductModel.findById(params.id)
  if (!product) {
    return Response.json({ message: 'Product not found' }, { status: 404 })
  }
  return Response.json(product)
}) as any

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }

  const {
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
    colors,
    sizes,
    isDiscounted,
    discountPercent,
    discountValue,
  } = await req.json()

  try {
    await dbConnect()

    const product = await ProductModel.findById(params.id)
    if (product) {
      product.name = name
      product.slug = slug
      product.price = price
      product.category = category
      product.image = image
      product.brand = brand
      product.countInStock = countInStock
      product.description = description
      product.colors = colors
      product.sizes = sizes
      product.isDiscounted = isDiscounted
      product.discountPercent = discountPercent
      product.discountValue = discountValue
      console.log(product)
      const updateProduct = await product.save()
      return Response.json(updateProduct)
    } else {
      return Response.json({ message: 'Product not found' }, { status: 404 })
    }
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}) as any

export const POST = auth(async (...args: any) => {
  const [req, { params }] = args

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }

  // Parse the body of the request
  const { isDiscounted, discountPercent, discountedPrice } = await req.json()

  // Validate incoming data
  if (
    typeof isDiscounted !== 'boolean' ||
    typeof discountPercent !== 'number'
  ) {
    return Response.json({ message: 'Invalid data' }, { status: 400 })
  }

  try {
    // Connect to the database if not already connected
    await dbConnect()

    // Update the product with discount data
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      params.productId,
      {
        isDiscounted,
        discountPercent,
        discountedPrice: discountedPrice || null, // Handle null case
      },
      { new: true }
    )

    // If product is not found
    if (!updatedProduct) {
      return Response.json({ message: 'Product not found' }, { status: 404 })
    }

    return Response.json(
      { message: 'Product updated with discount', product: updatedProduct },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      { message: 'Error updating product', error },
      { status: 500 }
    )
  }
}) as any

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
    const product = await ProductModel.findById(params.id)
    if (product) {
      await product.deleteOne()
      return Response.json({ message: 'Product deleted Successfully' })
    } else {
      return Response.json({ message: 'Product not found' }, { status: 404 })
    }
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}) as any
