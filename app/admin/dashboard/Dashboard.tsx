'use client'

import { formatNumber } from 'chart.js/helpers'
import Link from 'next/link'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import useSWR from 'swr'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
)

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/admin/orders/summary`)

  if (error) return error.message
  if (!summary) return 'Loading...'

  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Sales',
        data: summary.salesData.map(
          (x: { totalSales: number }) => x.totalSales
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgb(53, 162, 235, 0.5)',
      },
    ],
  }
  const ordersData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: summary.salesData.map(
          (x: { totalOrders: number }) => x.totalOrders
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgb(53, 162, 235, 0.5)',
      },
    ],
  }
  const productsData = {
    labels: summary.productsData.map((x: { _id: string }) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'CategoryScale',
        data: summary.productsData.map(
          (x: { totalProducts: number }) => x.totalProducts
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  }
  const usersData = {
    labels: summary.usersData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        label: 'Users',
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: summary.usersData.map(
          (x: { totalUsers: number }) => x.totalUsers
        ),
      },
    ],
  }

  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
  return (
    <div>
      <div className="my-4 stats inline-grid stats-vertical lg:stats-horizontal xl:stats-horizontal xxl:stats-horizontal  md:stats-horizontal xxl:flex xl:flex md:flex xxs:flex shadow">
        <div className="stat">
          <div className="stat-title">Sales</div>
          <div className="stat-value text-primary">
            ${formatNumber(summary.ordersPrice, 'en-US', options)}
          </div>
          <div className="stat-desc">
            <Link href="/admin/orders">View orders</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Products</div>
          <div className="stat-value text-primary">{summary.productsCount}</div>
          <div className="stat-desc">
            <Link href="/admin/products">View products</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Users</div>
          <div className="stat-value text-primary">{summary.usersCount}</div>
          <div className="stat-desc">
            <Link href="/admin/users">View users</Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 xxs:grid-cols-1 gap-4">
        <div>
          <h2 className="text-xl py-2">Sales Report</h2>
          <Line data={salesData} />
        </div>
        <div>
          <h2 className="text-xl py-2">Orders Report</h2>
          <Line data={ordersData} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 xxs:grid-cols-1 gap-4">
          <div>
            <h2 className="text-xl py-2">Products Report</h2>
            <div className="flex items-center justify-center h-80 w-96 md:w-40 lg:w-40 xl:w-56 xxl:w-56">
              <Doughnut data={productsData} />
            </div>
          </div>
          <div>
            <h2 className="text-xl py-2">Users Report</h2>
            <div className="flex items-center justify-center h-80 w-96">
              <Bar data={usersData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
