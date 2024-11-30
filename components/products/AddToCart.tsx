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
  countInStock: number
}

type SizeSelectorProps = {
  sizes: SizeOption[]
  product: Product
}
export default function AddToCart({ sizes, product }: SizeSelectorProps) {
  const { items, increase, decrease } = useCartService() // Get cart state and actions.
  const [selectedSize, setSelectedSize] = useState<string | null>(null) // Selected size.
  const [quantity, setQuantity] = useState(1) // Quantity for the selected size.
  const [existItem, setExistItem] = useState<OrderItem | undefined>() // Check if item exists in cart.
  const router = useRouter()

  useEffect(() => {
    if (selectedSize) {
      setExistItem(
        items.find((x) => x._id === product._id && x.size === selectedSize)
      ) // Find item in cart by product ID and size.
    } else {
      setExistItem(undefined)
    }
  }, [items, product._id, selectedSize])

  const handleSizeClick = (size: string) => {
    if (selectedSize === size) {
      setSelectedSize(null) // Deselect size.
    } else {
      setSelectedSize(size) // Select size.
    }
  }

  const handleAddToCart = () => {
    console.log('Handle Add to Cart triggered...')
    try {
      if (!existItem) {
        console.log('Adding new item to cart...')
        increase({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
          size: selectedSize!,
          qty: quantity,
          color: 'Black', // Default color.
        })
        console.log('Item added successfully. Navigating to /cart...')
      } else {
        console.log('Item already exists in cart. Skipping...')
      }
    } catch (error) {
      console.error('Error in handleAddToCart:', error)
    }
    router.push('/cart')
  }

  const handleIncrease = () => {
    if (existItem) {
      increase({ ...existItem, qty: existItem.qty + 1 }) // Increment quantity.
    } else if (selectedSize) {
      handleAddToCart() // Add to cart if not already in it.
    }
  }

  const handleDecrease = () => {
    if (existItem && existItem.qty > 0) {
      decrease(existItem) // Decrease quantity in cart.
    }
  }

  const isDisabled = !selectedSize || (existItem ? existItem.qty === 0 : false) // Disable Add to Cart button.

  return (
    <div className="p-4">
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
              onClick={() => {
                if (!isOutOfStock) handleSizeClick(option.size)
              }}
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
                    ? 'opacity-50 cursor-not-allowed'
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
