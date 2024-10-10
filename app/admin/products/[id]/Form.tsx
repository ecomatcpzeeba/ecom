'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductEditForm({ productId }: { productId: string }) {
  const { data: product, error } = useSWR(`/api/admin/products/${productId}`)
  const router = useRouter()
  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)
      toast.success('Product updated successfully')
      router.push('/admin/products')
    }
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Product>()

  const handleSingleImageUpload = async (e: any) => {
    const toastId = toast.loading('Uploading image...')
    try {
      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
      })
      const { signature, timestamp } = await resSign.json()
      const file = e.target.files[0]

      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await res.json()
      setValue('image', data.secure_url)
      toast.success('File uploaded successfully', {
        id: toastId,
      })
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      })
    }
  }

  useEffect(() => {
    if (product) {
      setValue('name', product.name)
      setValue('slug', product.slug)
      setValue('price', product.price)
      setValue('image', product.image)
      setValue('category', product.category)
      setValue('brand', product.brand)
      setValue('countInStock', product.countInStock)
      setValue('description', product.description)
      setValue('colors', product.colors)
      setValue('sizes', product.sizes)
    }
  }, [product, setValue])

  const onSubmit = async (formData: any) => {
    await updateProduct(formData)
  }

  if (error) return error.message
  if (!product) return 'Loading...'

  return (
    <div>
      <h1 className="text-2xl py-4">Edit Product {formatId(productId)}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Product Details */}
        <div className="mb-4">
          <label>Product Name</label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="w-full border p-2"
          />
          {errors.name && (
            <span className="text-red-500">Name is required</span>
          )}
        </div>

        <div className="mb-4">
          <label>Slug</label>
          <input
            type="text"
            {...register('slug', { required: true })}
            className="w-full border p-2"
          />
          {errors.slug && <span className="text-red-500">Slug is require</span>}
        </div>

        <div className="md:flex mb-6">
          {product.image && (
            <Image
              src={product.image}
              alt="Product Image"
              className="w-32 h-32 mb-4"
              width={48}
              height={48}
            />
          )}
          <label className="label md:w-1/5" htmlFor="imageFile">
            Upload Image
          </label>
          <div className="md:w-4/5">
            <input
              type="file"
              className="file-input w-full max-w-md"
              id="imageFile"
              onChange={(e) => handleSingleImageUpload(e)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label>Price</label>
          <input
            type="number"
            {...register('price', { required: true })}
            className="w-full border p-2"
          />
          {errors.price && (
            <span className="text-red-500">Price is required</span>
          )}
        </div>

        <div className="mb-4">
          <label>Category</label>
          <input
            type="text"
            {...register('category', { required: true })}
            className="w-full border p-2"
          />
          {errors.category && (
            <span className="text-red-500">Category is required</span>
          )}
        </div>

        <div className="mb-4">
          <label>Brand</label>
          <input
            type="text"
            {...register('brand', { required: true })}
            className="w-full border p-2"
          />
          {errors.brand && (
            <span className="text-red-500">Brand is required</span>
          )}
        </div>

        <div className="mb-4">
          <label>Description</label>
          <input
            type="text"
            {...register('description', { required: true })}
            className="w-full border p-2"
          />
          {errors.description && (
            <span className="text-red-500">Description is required</span>
          )}
        </div>

        <div className="mb-4">
          <label>Count In Stock</label>
          <input
            type="number"
            {...register('countInStock', { required: true })}
            className="w-full border p-2"
          />
          {errors.countInStock && (
            <span className="text-red-500">Count in Stock is required</span>
          )}
        </div>

        <div className="mb-4">
          <label>Color</label>
          <input
            type="text"
            {...register('colors', { required: true })}
            className="w-full border p-2"
          />
          {errors.colors && (
            <span className="text-red-500">Color is required</span>
          )}
        </div>

        <div className="mb-4">
          <label>Size</label>
          <input
            type="text"
            {...register('sizes', { required: true })}
            className="w-full border p-2"
          />
          {errors.sizes && (
            <span className="text-red-500">Size is required</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded btn ml-4 "
        >
          {isUpdating && <span className="loading loading-spinner"></span>}
          Update Product
        </button>
        <Link className="btn ml-4 " href="/admin/products">
          Cancel
        </Link>
      </form>
    </div>
  )
}
