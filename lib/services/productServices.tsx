//function to load data from database
import { cache } from 'react'
import dbConnect from '../dbConnect'
import ProductModel, { Product } from '../models/ProductModel'

//we use cache to cache te database query result and prevent multiple hitting database

export const revalidate = 3600 //the cache value will be updated every 1 hour

const getLatest = cache(async () => {
  await dbConnect()
  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(20)
    .lean() //sort based in id in deccending order so we call the latest product first, limit 4 to get first 4 results only and use lean to convert result to plain javascript
  return products as Product[]
})

const getFeatured = cache(async () => {
  await dbConnect()
  const products = await ProductModel.find({ isFeatured: true }).limit(3).lean()
  return products as Product[]
})

const getBySlug = cache(async (slug: string) => {
  await dbConnect()
  const product = await ProductModel.findOne({ slug }).lean()
  return product as Product
})

const PAGE_SIZES = 3
const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    price,
    rating,
    page = '1',
  }: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }) => {
    await dbConnect()

    const queryFilter =
      q && q !== 'all'
        ? {
            name: {
              $regex: q,
              $options: 'i',
            },
          }
        : {}
    const categoryFilter = category && category !== 'all' ? { category } : {}
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {}
    //10-50
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {}
    const order: Record<string, 1 | -1> =
      sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'toprated'
        ? { rating: -1 }
        : { _id: -1 }

    const categories = await ProductModel.find().distinct('category')
    const products = await ProductModel.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
      '-reviews'
    )
      .sort(order)
      .skip(PAGE_SIZES * (Number(page) - 1))
      .limit(PAGE_SIZES)
      .lean()

    const countProducts = await ProductModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })

    return {
      products: products as Product[],
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZES),
      categories,
    }
  }
)

const getCategories = cache(async () => {
  await dbConnect()
  const categories = await ProductModel.find().distinct('category')
  return categories
})

const getLatestByCategory = cache(async (category: string) => {
  await dbConnect()

  const products = await ProductModel.find({ category }) // Filter by category
    .sort({ _id: -1 }) // Sort by ID in descending order
    .limit(5) // Limit to the last 5 products
    .lean() // Convert to plain JavaScript objects

  return products as Product[] // Return products
})

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
  getLatestByCategory,
}
export default productService
