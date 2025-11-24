import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 30

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'categories',
      depth: 1,
      limit: 100,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
