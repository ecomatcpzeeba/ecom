'use client'
import useCartService from '@/lib/hooks/useCartStore'
import { OrderItem } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AddToCart({ item }: { item: OrderItem }) {
  const router = useRouter() // you want to redirect user after adding to the cart to the cart page.
  const { items, increase, decrease } = useCartService() //get items and increase function from useCartService hooks.
  const [existItem, setExistItem] = useState<OrderItem | undefined>() //declare existItem state

  useEffect(() => {
    setExistItem(items.find((x) => x._id === item._id))
  }, [item, items]) //set exist items based on items array

  const addToCartHandler = () => {
    increase(item) //pass item from AddToCart function's props
  }
  return existItem ? (
    <div>
      <button className="btn" type="button" onClick={() => decrease(existItem)}>
        -
      </button>
      <span className="px-2">{existItem.qty}</span>{' '}
      {/*show the quantity of the added item the cart*/}
      <button className="btn" type="button" onClick={() => increase(existItem)}>
        +
      </button>
      {/*Render + button to increase the number of items in the cart by calling increase function and pasing exist item  as parameter*/}
    </div>
  ) : (
    <button
      className="btn btn-primary w-full"
      type="button"
      onClick={addToCartHandler}
    >
      Add to cart
    </button> //if we have that product in our cart, then show "+" "-" button else show "Add to cart" button
  )
}
