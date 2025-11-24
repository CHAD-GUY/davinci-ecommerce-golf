import { getPayload } from 'payload'
import config from '@/payload.config'

let cachedPayload: any = null

export async function getPayloadClient() {
  if (cachedPayload) {
    return cachedPayload
  }

  cachedPayload = await getPayload({ config })
  return cachedPayload
}

// Get all products with filters
export async function getProducts(options?: {
  limit?: number
  page?: number
  category?: string
  featured?: boolean
  status?: string
  search?: string
  sort?: string
}) {
  const payload = await getPayloadClient()

  const where: any = {}

  if (options?.category) {
    where.category = { equals: options.category }
  }

  if (options?.featured !== undefined) {
    where.featured = { equals: options.featured }
  }

  if (options?.status) {
    where.status = { equals: options.status }
  }

  if (options?.search) {
    where.name = { contains: options.search }
  }

  const result = await payload.find({
    collection: 'products',
    where,
    limit: options?.limit || 50,
    page: options?.page || 1,
    sort: options?.sort || '-createdAt',
    depth: 2, // Include relationships (category, images)
  })

  return result
}

// Get a single product by slug
export async function getProductBySlug(slug: string) {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
    },
    depth: 2,
    limit: 1,
  })

  return result.docs[0] || null
}

// Get all categories
export async function getCategories(options?: {
  limit?: number
  page?: number
}) {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'categories',
    limit: options?.limit || 50,
    page: options?.page || 1,
    depth: 1,
  })

  return result
}

// Get a single category by slug
export async function getCategoryBySlug(slug: string) {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: slug },
    },
    depth: 1,
    limit: 1,
  })

  return result.docs[0] || null
}

// Get products by category slug
export async function getProductsByCategory(categorySlug: string, options?: {
  limit?: number
  page?: number
  sort?: string
}) {
  const payload = await getPayloadClient()

  // First get the category
  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    return { docs: [], totalDocs: 0, limit: 0, page: 0, totalPages: 0 }
  }

  // Then get products for that category
  return getProducts({
    category: category.id,
    limit: options?.limit,
    page: options?.page,
    sort: options?.sort,
  })
}

// Get featured products
export async function getFeaturedProducts(limit: number = 6) {
  return getProducts({ featured: true, status: 'active', limit })
}

// Get coupons
export async function getCoupons() {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'coupons',
    where: {
      active: { equals: true },
    },
  })

  return result
}
