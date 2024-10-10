import data from '@/lib/data'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import UserModel from '@/lib/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  await dbConnect()

  // Check if users and products already exist in the database
  const existingUsers = await UserModel.find().exec()
  const existingProducts = await ProductModel.find().exec()

  if (existingUsers.length > 0 && existingProducts.length > 0) {
    // If data exists, return it
    return NextResponse.json({
      message: 'Data already exists in the database',
      users: existingUsers,
      products: existingProducts,
    })
  }

  // If no data exists, seed the database
  const { users, products } = data

  await UserModel.deleteMany()
  await UserModel.insertMany(users)

  await ProductModel.deleteMany()
  await ProductModel.insertMany(products)

  return NextResponse.json({
    message: 'Database seeded successfully',
    users,
    products,
  })
}
