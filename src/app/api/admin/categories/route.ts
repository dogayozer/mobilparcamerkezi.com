import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const cookieStore: any = cookies()
  const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
  const session = store.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const { name, slug, template_type } = await req.json()
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        template_type: template_type || 'generic',
      },
    })
    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
