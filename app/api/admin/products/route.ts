import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }
  await dbConnect()
  const products = await ProductModel.find()
  return Response.json(products)
}) as any

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }
  await dbConnect()

  const product = new ProductModel({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
    colors: 'Black',
    sizes: 'XL',
    isDiscounted: true,
    discountPercent: 0,
    isFeatured: false,
    banner:
      'https://res.cloudinary.com/doeqt3wfr/image/upload/v1731129832/cv0o9rdvfms4vigszlml.png',
    size: [
      { size: 'M', countInStock: 30 },
      { size: 'L', countInStock: 5 },
      { size: 'XL', countInStock: 15 },
    ],
  })
  try {
    await product.save()
    return Response.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    )
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}) as any
