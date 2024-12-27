import AddToCart from '@/components/products/AddToCart'
import productService from '@/lib/services/productServices'
import Image from 'next/image'
import Link from 'next/link'
import { convertDocToObj } from '@/lib/utils'
import { Rating } from '@/components/products/Rating'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const product = await productService.getBySlug(params.slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails({
  params,
}: {
  params: { slug: string }
}) {
  const product = await productService.getBySlug(params.slug)
  if (!product) {
    return <div> Product Not found!</div>
  }

  const allProducts = await productService.getProductByCategory(
    product.category,
    product.name
  )

  const hasDiscount = product.isDiscounted && (product.discountPercent ?? 0) > 0

  return (
    <>
      <div className="my-2">
        <Link href="/">Back to products</Link>
      </div>
      <div className="grid xxl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 lg:gap-3 xl:gap-3 xxl:gap-3 md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2 xl:col-span-2 xxl:col-span-2 lg:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={320}
            sizes="100vw"
            style={{
              width: '100%',
            }}
          ></Image>
        </div>
        <div>
          <ul className="space-y-4">
            <li>
              <h1 className="text-xl">{product.name}</h1>
            </li>
            <li>
              <Rating
                value={product.rating}
                caption={`${product.numReviews} ratings`}
              />
            </li>
            <li> {product.brand}</li>
            <li>
              <ul className="flex justify-center">
                {allProducts.map((x) => (
                  <li key={x._id} className="bg-gray-300">
                    <Link href={`/product/${x.slug}`}>
                      <Image
                        src={x.image}
                        alt={x.name}
                        width={58}
                        height={58}
                        className="rounded-full m-2"
                      ></Image>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              Description: <p>{product.description}</p>
            </li>
          </ul>
          <div className="card bg-base-300 shadow-xl mt-3 md:mt-0">
            <div className="card-body">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>
                  {hasDiscount ? (
                    <div>
                      <span className="text-lg text-gray-500 line-through">
                        ₹ {product.price}
                      </span>
                      <span className="text-2xl text-red-600 font-bold ml-2">
                        ₹ {product.discountValue?.toFixed(2)}
                      </span>
                      <span className="text-sm text-red-500 ml-2">
                        ({product.discountPercent}% OFF)
                      </span>
                    </div>
                  ) : (
                    <span>₹ {product.price}</span>
                  )}
                </div>
              </div>

              <AddToCart
                sizes={product.sizes}
                product={convertDocToObj(product)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
