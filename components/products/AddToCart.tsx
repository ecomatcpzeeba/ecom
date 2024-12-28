'use client'

import { useState, useEffect } from 'react'
import useCartService from '@/lib/hooks/useCartStore'
import { OrderItem } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'

type SizeOption = {
  size: string
  countInStock: number
}

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  image: string
  sizes: SizeOption[]
  discountPercent?: number
  discountValue?: number
  isDiscounted?: boolean
}

type SizeSelectorProps = {
  sizes: SizeOption[]
  product: Product
}

export default function AddToCart({ sizes, product }: SizeSelectorProps) {
  const { items, increase, decrease } = useCartService()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [existItem, setExistItem] = useState<OrderItem | undefined>()
  const [sizeStockStatus, setSizeStockStatus] =
    useState<string>('Select a size')
  const router = useRouter()

  const hasDiscount = product.isDiscounted && (product.discountPercent ?? 0) > 0

  useEffect(() => {
    if (selectedSize) {
      const selectedOption = sizes.find((size) => size.size === selectedSize)
      if (selectedOption?.countInStock) {
        setSizeStockStatus('In Stock')
      } else {
        setSizeStockStatus('Out of Stock')
      }

      setExistItem(
        items.find((x) => x._id === product._id && x.size === selectedSize)
      )
    } else {
      setExistItem(undefined)
      setSizeStockStatus('Select a size')
    }
  }, [selectedSize, sizes, items, product._id])

  const handleSizeClick = (size: string) => {
    const selectedOption = sizes.find((option) => option.size === size)
    if (selectedOption) {
      setSelectedSize(size)
      setSizeStockStatus(
        selectedOption.countInStock > 0 ? 'In Stock' : 'Out of Stock'
      )
    }
  }

  const handleAddToCart = () => {
    if (!existItem) {
      increase({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: hasDiscount
          ? product.discountValue ?? product.price
          : product.price,
        image: product.image,
        size: selectedSize!,
        qty: quantity,
        color: 'Black',
      })
    }
    router.push('/cart')
  }

  const handleIncrease = () => {
    if (existItem) {
      increase({ ...existItem, qty: existItem.qty + 1 })
    } else if (selectedSize) {
      handleAddToCart()
    }
  }

  const handleDecrease = () => {
    if (existItem && existItem.qty > 0) {
      decrease(existItem)
    }
  }

  const isDisabled = !selectedSize || (existItem ? existItem.qty === 0 : false)

  return (
    <div className="p-4">
      <p
        className={`text-lg font-bold ${
          sizeStockStatus === 'In Stock' ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {sizeStockStatus}
      </p>

      <label htmlFor="size" className="block text-sm font-medium mb-2">
        Select Size:
      </label>
      <div className="flex gap-4">
        {sizes.map((option) => {
          const isSelected = selectedSize === option.size
          const isOutOfStock = option.countInStock === 0

          return (
            <button
              key={option.size}
              onClick={() => handleSizeClick(option.size)}
              disabled={isOutOfStock}
              className={`w-16 h-16 flex items-center justify-center rounded-full border 
                transition-colors duration-200 
                ${
                  isSelected
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-black'
                } 
                ${
                  isOutOfStock
                    ? 'opacity-50 cursor-not-allowed line-through'
                    : 'hover:bg-yellow-300'
                }`}
            >
              {option.size}
            </button>
          )
        })}
      </div>

      {selectedSize && (
        <p className="mt-4 text-sm text-gray-600">
          You have selected size:{' '}
          <span className="font-semibold">{selectedSize}</span>
        </p>
      )}

      <div className="mt-4">
        <p className="text-lg">
          Price:{' '}
          {hasDiscount ? (
            <span>
              <span className="text-gray-500 line-through mr-2">
                ₹ {product.price}
              </span>
              <span className="text-red-600 font-bold">
                ₹ {product.discountValue?.toFixed(2)}
              </span>
              <span className="text-sm text-red-500 ml-2">
                ({product.discountPercent}% OFF)
              </span>
            </span>
          ) : (
            <span>₹ {product.price}</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          className={`btn ${
            existItem && existItem.qty > 0
              ? ''
              : 'opacity-50 cursor-not-allowed'
          }`}
          type="button"
          onClick={handleDecrease}
          disabled={!existItem || existItem.qty === 0}
        >
          -
        </button>
        <span className="px-2">{existItem ? existItem.qty : quantity}</span>
        <button className="btn" type="button" onClick={handleIncrease}>
          +
        </button>
      </div>

      <button
        className={`btn btn-primary w-full mt-4 ${
          !isDisabled ? '' : 'opacity-50 cursor-not-allowed'
        }`}
        type="button"
        onClick={handleAddToCart}
        disabled={isDisabled}
      >
        Add to Cart
      </button>
    </div>
  )
}
