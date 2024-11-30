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
    speed: 500, // Slide transition speed
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Time interval between autoplay slides
    arrows: true, // Enable left and right arrows
    dots: false, // Disable dots (you can set it to true if you want dots)
    infinite: true, // Ensure infinite looping is enabled
    pauseOnHover: true,
    waitForAnimate: false,
  }

  return (
    <Slider {...settings} className="slider-container">
      {featuredProducts.map((product) => (
        <div key={product._id} className="w-full carousel rounded-box mt-4">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.banner as string}
              alt={product.name}
              width={1500}
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
