import React from 'react'
import { cookies } from 'next/headers'
import Dashboard from './Dashboard'
import LoginForm from './LoginForm'
import { prisma } from '@/lib/prisma'

export const revalidate = 0

export default async function AdminPage() {
  const cookieStore: any = cookies()
  const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
  const session = store.get('admin_session')

  if (session?.value !== 'authenticated') {
    return <LoginForm />
  }

  // NOT: Product/Category artık Fodos ile ortak. Order ise store:'mpm' ile filtreleniyor —
  // aksi halde bu panelde Fodos'un siparişleri de görünürdü (bkz. Faz 2 planı).
  let [productCount, orderCount, mpmCustomerOrders, recentOrders, categories, settings] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count({ where: { store: 'mpm' } }),
      prisma.order.findMany({
        where: { store: 'mpm' },
        select: { customerId: true },
        distinct: ['customerId'],
      }),
      prisma.order.findMany({
        where: { store: 'mpm' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { customer: true, items: { include: { product: true } } },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true } } },
      }),
      prisma.storeSettings.findUnique({ where: { id: 'mpm' } }),
    ])

  const customerCount = mpmCustomerOrders.filter((o) => o.customerId).length

  return (
    <Dashboard
      stats={{
        productCount,
        orderCount,
        customerCount,
      }}
      recentOrders={recentOrders}
      categories={categories}
      settings={settings}
    />
  )
}
