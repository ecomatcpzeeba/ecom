import { Product } from '@/lib/models/ProductModel'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Rating } from './Rating'

export default function ProductItems({ product }: { product: Product }) {
  const hasDiscount = product.isDiscounted && (product.discountPercent ?? 0) > 0
  return (
    <div className="card bg-base-300 shadow-xl mb-4 max-w-sm rounded overflow-hidden">
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
      <div className="card-body p-2">
        <Link href={`/product/${product.slug}`}>
          <h2 className="card-title font-normal">{product.name}</h2>
        </Link>
        <Rating value={product.rating} caption={`${product.numReviews}`} />
        <p className="mb-2">{product.brand}</p>
        <div className="card-actions flex items-center justify-between">
          {hasDiscount ? (
            <div>
              {/* Original Price Strikethrough */}
              <span className="text-lg text-gray-500 line-through">
                ₹ {product.price}
              </span>
              {/* Discounted Price */}
              <span className="text-2xl text-red-600 font-bold ml-2">
                ₹ {product.discountValue?.toFixed(2)}
              </span>
              {/* Discount Percentage */}
              <span className="text-sm text-red-500 ml-2">
                ({product.discountPercent}% OFF)
              </span>
            </div>
          ) : (
            <span className="text-2xl">₹ {product.price}</span>
          )}
        </div>
      </div>
    </div>
  )
}
