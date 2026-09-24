import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getCustomerFromRequest() {
  const session = await getSession()
  if (!session) return null

  const customer = await prisma.customer.findUnique({ where: { id: session.userId } })
  if (!customer || customer.isGuest) return null
  return customer
}
