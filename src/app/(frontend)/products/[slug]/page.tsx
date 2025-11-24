import { notFound } from 'next/navigation'
import { getProductBySlug, getSiteSettings } from '@/lib/payload'
import { ProductDetail } from '@/components/ecommerce/ProductDetail'
import type { Category, Media } from '@/payload-types'
import { serialize } from '@/lib/serializeLexical'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// Generate dynamic metadata for each product
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe',
    }
  }

  const settings = await getSiteSettings()
  const siteName = settings.siteName || 'Ecommerce Davinci'
  const siteUrl = settings.siteUrl || 'https://davinci-store.com'

  // Use SEO fields if available, otherwise fallback to product data
  const title = product.seo?.title || product.name
  const description = product.seo?.description || `${product.name} - Desde $${product.price}`
  const keywords = product.seo?.keywords || product.tags?.map((t: any) => t.tag).join(', ')

  // Get the first product image for OG
  const firstImage = product.images[0]?.image as Media | undefined
  const ogImage = firstImage?.url

  const category = product.category as Category
  const productUrl = `${siteUrl}/products/${product.slug}`

  return {
    title, // Will use the template from root layout: "Product Name | Site Name"
    description,
    keywords: keywords?.split(',').map((k: string) => k.trim()) || [],
    openGraph: {
      type: 'website',
      url: productUrl,
      title,
      description,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ] : undefined,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: productUrl,
    },
    // Product-specific structured data
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'ARS',
      'product:availability': product.status === 'active' ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': siteName,
      'product:category': category.name,
    },
  }
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
    variants: product.variants?.map((v: any) => {
      const variantImage = v.image as Media | undefined
      return {
        id: v.id || '',
        name: v.name,
        color: v.color || undefined,
        size: v.size || undefined,
        price: v.price,
        stock: v.stock,
        sku: v.sku,
        image: variantImage ? {
          url: variantImage.url || '/placeholder-product.jpg',
          alt: variantImage.alt || `${product.name} - ${v.name}`,
        } : undefined,
      }
    }),
    simpleStock: product.simpleStock || 0,
    featured: product.featured || false,
    status: product.status,
    tags: product.tags?.map((t: any) => t.tag) || [],
    sku: product.sku,
  }

  return <ProductDetail product={transformedProduct} />
}
