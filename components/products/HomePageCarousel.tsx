'use client' // This should remain as a client component

import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import Link from 'next/link'
import { Rating } from './Rating'
import productService from '@/lib/services/productServices'
import { Product } from '@/lib/models/ProductModel'

export default function HomePageCarousel() {
  const [latestProductsByCategory, setLatestProductsByCategory] = useState<
    Product[]
  >([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getLatestByCategory('Leggings')
        setLatestProductsByCategory(products)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div>
      <h2 className="text-2xl py-2">Latest Products By Category</h2>
      <Slider {...sliderSettings}>
        {latestProductsByCategory.map((product) => (
          <div
            key={product._id}
            className="card bg-base-300 shadow-xl mb-4 max-w-sm rounded overflow-hidden"
          >
            <figure>
              <Link href={`/product/${product.slug}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover w-full"
                />
              </Link>
            </figure>
            <div className="card-body">
              <Link href={`/product/${product.slug}`}>
                <h2 className="card-title font-normal">{product.name}</h2>
              </Link>
              <Rating
                value={product.rating}
                caption={`${product.numReviews}`}
              />
              <p className="mb-2">{product.brand}</p>
              <div className="card-actions flex items-center justify-between">
                <span className="text-2xl">₹ {product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
