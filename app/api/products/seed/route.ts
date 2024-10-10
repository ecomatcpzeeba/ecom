import data from '@/lib/data'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import UserModel from '@/lib/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  // Check if we are not in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      message: 'Seeding skipped in production',
    })
  }

  const { users, products } = data
  await dbConnect()

  // Seeding Users
  await UserModel.deleteMany()
  await UserModel.insertMany(users)

  // Seeding Products
  await ProductModel.deleteMany()
  await ProductModel.insertMany(products)

  return NextResponse.json({
    message: 'Seeded successfully',
    users,
    products,
  })
}
