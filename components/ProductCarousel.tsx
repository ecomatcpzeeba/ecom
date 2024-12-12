'use client'
import Slider from 'react-slick'
import { Product } from '@/lib/models/ProductModel'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCarouselProps {
  featuredProducts: Product[]
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  featuredProducts,
}) => {
  const settings = {
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: false,
    infinite: true,
    pauseOnHover: true,
    waitForAnimate: false,
  }

  return (
    <Slider {...settings} className="slider-container">
      {featuredProducts.map((product) => (
        <div key={product._id} className="w-full carousel mt-4">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.banner as string}
              alt={product.name}
              width={1700}
              height={500}
              priority
            />
          </Link>
        </div>
      ))}
    </Slider>
  )
}

export default ProductCarousel
