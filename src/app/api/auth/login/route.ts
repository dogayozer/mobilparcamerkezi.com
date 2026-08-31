import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir' }, { status: 400 })
    }

    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!customer || !customer.password) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, customer.password)
    if (!isValid) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 })
    }

    await createSession({
      userId: customer.id,
      email: customer.email,
      name: customer.name,
    })

    return NextResponse.json({ success: true, user: { id: customer.id, email: customer.email, name: customer.name } })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Giriş yapılamadı' }, { status: 500 })
  }
}
