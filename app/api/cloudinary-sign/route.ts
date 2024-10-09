import { auth } from '@/lib/auth'
import cloudinary from 'cloudinary'
import { NextApiRequest, NextApiResponse } from 'next'

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }

  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_SECRET!
  )
  return Response.json({ signature, timestamp })
}) as any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const { publicId } = req.body

    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' })
    }

    try {
      const result = await cloudinary.v2.uploader.destroy(publicId)
      if (result.result === 'ok') {
        return res.status(200).json({ message: 'Image deleted successfully' })
      } else {
        return res.status(500).json({ message: 'Failed to delete image' })
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      return res.status(500).json({ message: 'Error deleting image' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
