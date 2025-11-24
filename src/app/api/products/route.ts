import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const payload = await getPayloadClient()

    const where: any = {
      status: { equals: 'active' }
    }

    if (category && category !== 'all') {
      where.category = { equals: category }
    }

    const result = await payload.find({
      collection: 'products',
      where,
      depth: 2,
      limit: 100,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
