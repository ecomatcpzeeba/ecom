import React from 'react'
import CartDetails from './CartDetails'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: '...',
}

const CartPage = () => {
  return <CartDetails />
}

export default CartPage
