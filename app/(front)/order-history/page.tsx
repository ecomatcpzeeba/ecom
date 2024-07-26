import { Metadata } from 'next'
import MyOrders from './MyOrders'

export const metadata: Metadata = {
  title: 'Order History',
}

export default async function MyOrdersPage() {
  return (
    <>
      <h1 className="text-2xl py-2"></h1>
      <MyOrders />
    </>
  )
}
