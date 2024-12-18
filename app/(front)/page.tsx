/* eslint-disable @next/next/no-img-element */
import ProductItems from '@/components/products/ProductItems'
import productService from '@/lib/services/productServices'
import { convertDocToObj } from '@/lib/utils'
import { Metadata } from 'next'
import { Product } from '@/lib/models/ProductModel'
import 'slick-carousel/slick/slick.css' // Import Slick Carousel styles
import 'slick-carousel/slick/slick-theme.css' // Import Slick Carousel theme styles
import ProductCarousel from '@/components/ProductCarousel'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'CP zeeba',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'This is the description of this website',
}

export default async function Home() {
  const featuredProducts: Product[] = await productService.getFeatured()
  const latestProducts: Product[] = await productService.getLatest()

  return (
    <>
      <ProductCarousel featuredProducts={featuredProducts} />
      <h2 className="text-2xl p-1">Latest Products</h2>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-6 sm:grid-cols-3 xxs:grid-cols-2 xs:grid-cols-2 s:grid-cols-1">
        {/* Render latest products using ProductItems component */}
        {latestProducts.map((product) => (
          <ProductItems key={product._id} product={convertDocToObj(product)} />
        ))}
      </div>
    </>
  )
}
