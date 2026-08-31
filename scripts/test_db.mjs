import { PrismaClient } from '@prisma/client'

const p = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_9tqK6XoALEPC@ep-muddy-credit-auo9rm9r-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require',
    },
  },
})

async function test() {
  try {
    const c = await p.product.count()
    console.log('Successfully connected to DB! Product count in source:', c)
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    await p.$disconnect()
  }
}

test()
