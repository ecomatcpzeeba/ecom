import ProductItems from '@/components/products/ProductItems'
import { Rating } from '@/components/products/Rating'
import productService from '@/lib/services/productServices'
import Link from 'next/link'

const sortOrders = ['newest', 'lowest', 'highest', 'rating']
const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
]

const ratings = [5, 4, 3, 2, 1]

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ' '}
            ${category !== 'all' ? `: Category ${category}` : ''} 
            ${price !== 'all' ? `: Price ${price}` : ''}
            ${rating !== 'all' ? `Rating ${rating}` : ''}`,
    }
  } else {
    return {
      title: 'Search Products',
    }
  }
}

export default async function SearchPage({
  searchParams: {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {
    const params = { q, category, price, rating, sort, page }
    if (c) params.category = c
    if (p) params.price = p
    if (r) params.rating = r
    if (pg) params.page = pg
    if (s) params.sort = s
    return `/search?${new URLSearchParams(params).toString()}`
  }
  const categories = await productService.getCategories()
  const { countProducts, products, pages } = await productService.getByQuery({
    category,
    q,
    price,
    rating,
    page,
    sort,
  })
  return (
    <div className="grid xs:grid-cols-1 xxs:grid-cols-1 xl:grid-cols-5 xxl:grid-cols-5 lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-5 gap-5">
      <div>
        <div className="text-xl pt-3"> Department</div>
        <div>
          <ul>
            <li>
              <Link
                className={`link link-hover ${
                  'all' === category && 'link-primary'
                }`}
                href={getFilterUrl({ c: 'all' })}
              >
                Any
              </Link>
            </li>
            {categories.map((c: string) => (
              <li key={c}>
                <Link
                  className={`link link-hover ${
                    c === category && 'link-primary'
                  }`}
                  href={getFilterUrl({ c })}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3">Price</div>
          <ul>
            <li>
              <Link
                className={`link link-hover ${
                  'all' === price && 'link-primary'
                }`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`link link-hover ${
                    p.value === price && 'link-primary'
                  }`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3">Customer Review</div>
          <ul>
            {ratings.map((r) => (
              <Link
                key={r}
                href={getFilterUrl({ r: `${r}` })}
                className={`link link-hover ${
                  `${r}` === rating && 'link-primary'
                }`}
              >
                <Rating caption={' & up'} value={r}></Rating>
              </Link>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 lg:col-span-4 xl:col-span-4 xxl:col-span-4 xs:col-span-4 xxs:col-span-4 sm:col-span-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            {products.length === 0 ? 'No' : countProducts} Results
            {q !== 'all' && q !== '' && ' : ' + q}
            {category !== 'all' && ' : ' + category}
            {price !== 'all' && ' : Price ' + price}
            {rating !== 'all' && ' : Rating ' + rating + ' & up'}
            &nbsp;
            {(q !== 'all' && q !== ' ') ||
            category !== 'all' ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Link className="btn btn-sm btn-ghost" href="/search"></Link>
            ) : null}
          </div>
          <div>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 link link-hover ${
                  sort == s ? 'link-primary' : ''
                }`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-3 ">
            {products.map((product) => (
              <ProductItems key={product._id} product={product} />
            ))}
          </div>
          <div className="join">
            {products.length > 0 &&
              Array.from(Array(pages).keys()).map((p) => (
                <Link
                  key={p}
                  className={`join-item btn ${
                    Number(page) === p + 1 ? 'btn-active' : ''
                  }`}
                  href={getFilterUrl({ pg: `${p + 1}` })}
                >
                  {p + 1}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
