import mongoose from 'mongoose'

export const SizeSchema = new mongoose.Schema({
  countInStock: { type: Number, required: true, default: 0 },
  size: { type: String, required: [true, 'Size is required'], default: 'N/A' },
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
    description: { type: String, required: true },
    colors: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: { type: String, required: false },
    isDiscounted: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0 },
    discountValue: { type: Number, default: 0 },
    sizes: { type: [SizeSchema], required: true },
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
  isDiscounted?: boolean
  discountPercent?: number
  discountValue?: number
  sizes: Array<{ size: string; countInStock: number }>
}
