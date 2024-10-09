import { auth } from '@/lib/auth'
import cloudinary from 'cloudinary'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
  }

  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_SECRET!
  )
  return NextResponse.json({ signature, timestamp })
}) as any

// DELETE request handler
export const DELETE = async (req: Request) => {
  const reqBody = await req.json() // Parse the request body
  const { publicId } = reqBody

  if (!publicId) {
    return NextResponse.json(
      { message: 'Public ID is required' },
      { status: 400 }
    )
  }

  try {
    const result = await cloudinary.v2.uploader.destroy(publicId)

    if (result.result === 'ok') {
      return NextResponse.json(
        { message: 'Image deleted successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: 'Failed to delete image' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { message: 'Error deleting image' },
      { status: 500 }
    )
  }
}
