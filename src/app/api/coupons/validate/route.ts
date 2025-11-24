import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, cartTotal } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Código de cupón requerido' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()

    // Find coupon by code
    const result = await payload.find({
      collection: 'coupons',
      where: {
        code: { equals: code.toUpperCase() },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        { error: 'Cupón inválido o no existe' },
        { status: 404 }
      )
    }

    const coupon = result.docs[0]

    // Validate coupon is active
    if (!coupon.active) {
      return NextResponse.json(
        { error: 'Este cupón no está activo' },
        { status: 400 }
      )
    }

    // Validate date range
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)

    if (now < validFrom) {
      return NextResponse.json(
        { error: 'Este cupón aún no es válido' },
        { status: 400 }
      )
    }

    if (coupon.validUntil) {
      const validUntil = new Date(coupon.validUntil)
      if (now > validUntil) {
        return NextResponse.json(
          { error: 'Este cupón ha expirado' },
          { status: 400 }
        )
      }
    }

    // Validate usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'Este cupón ha alcanzado su límite de uso' },
        { status: 400 }
      )
    }

    // Validate minimum purchase
    if (coupon.minimumPurchase && cartTotal < coupon.minimumPurchase) {
      return NextResponse.json(
        {
          error: `Este cupón requiere una compra mínima de $${coupon.minimumPurchase}`,
          minimumPurchase: coupon.minimumPurchase
        },
        { status: 400 }
      )
    }

    // Calculate discount amount
    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100)
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue
    }

    // Return valid coupon data
    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Error al validar el cupón', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
