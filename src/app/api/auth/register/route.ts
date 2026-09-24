import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { parseAccountType } from '@/lib/accountTypes'

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, accountType: rawAccountType, businessType: rawBusinessType } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Ad, e-posta ve şifre zorunludur' }, { status: 400 })
    }

    const account = parseAccountType(rawAccountType, rawBusinessType)
    if (!account) {
      return NextResponse.json({ error: 'Lütfen işletme türünü seçin' }, { status: 400 })
    }

    const existing = await prisma.customer.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existing && existing.password) {
      return NextResponse.json({ error: 'Bu e-posta adresiyle zaten bir hesap mevcut' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let customer
    if (existing) {
      customer = await prisma.customer.update({
        where: { id: existing.id },
        data: {
          name,
          phone: phone || existing.phone,
          password: hashedPassword,
          isGuest: false,
          accountType: account.accountType,
          businessType: account.businessType,
        },
      })
    } else {
      customer = await prisma.customer.create({
        data: {
          name,
          email: email.toLowerCase().trim(),
          phone: phone || null,
          password: hashedPassword,
          isGuest: false,
          accountType: account.accountType,
          businessType: account.businessType,
        },
      })
    }

    await createSession({
      userId: customer.id,
      email: customer.email,
      name: customer.name,
    })

    return NextResponse.json({ success: true, user: { id: customer.id, email: customer.email, name: customer.name } })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Kayıt yapılamadı' }, { status: 500 })
  }
}
