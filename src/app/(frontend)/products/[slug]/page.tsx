import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/payload'
import { ProductDetail } from '@/components/ecommerce/ProductDetail'
import type { Product, Category, Media } from '@/payload-types'
import { serialize } from '@/lib/serializeLexical'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const category = product.category as Category

  // Transform product data for the client component
  const transformedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice || undefined,
    description: serialize(product.description), // Convert rich text to HTML
    images: product.images.map((img: any) => {
      const media = img.image as Media
      return {
        url: media.url || '/placeholder-product.jpg',
        alt: media.alt || product.name,
      }
    }),
    category: {
      name: category.name,
      slug: category.slug,
    },
    productType: product.productType,
    variants: product.variants?.map((v: any) => ({
      id: v.id || '',
      name: v.name,
      color: v.color || undefined,
      size: v.size || undefined,
      price: v.price,
      stock: v.stock,
      sku: v.sku,
    })),
    simpleStock: product.simpleStock || 0,
    featured: product.featured || false,
    status: product.status,
    tags: product.tags?.map((t: any) => t.tag) || [],
    sku: product.sku,
  }

  return <ProductDetail product={transformedProduct} />
}
