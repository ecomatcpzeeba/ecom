import mongoose from 'mongoose'

export const SizeSchema = new mongoose.Schema({
  countInStock: { type: Number, required: true, default: 0 },
  size: { type: String, required: true },
})

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    colors: { type: String, required: true },
    sizes: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: { type: String, required: false },
    isDiscounted: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0 },
    discountValue: { type: Number, default: 0 },
    size: { type: [SizeSchema], required: true },
  },
  {
    timestamps: true,
  }
)

const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema)

export default ProductModel

export type Product = {
  _id?: string
  name: string
  slug: string
  image: string
  isFeatured?: boolean
  banner?: string
  price: number
  brand: string
  description: string
  category: string
  rating: number
  numReviews: number
  countInStock: number
  colors: string
  sizes: string
  isDiscounted?: boolean
  discountPercent?: number
  discountValue?: number
  size: Array<{ size: string; countInStock: number }>
}
