'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/ecommerce/ProductGrid'
import { ProductCard } from '@/components/ecommerce/ProductCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/payload-types'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductsContentProps {
  categories: Category[]
}

export function ProductsContent({ categories }: ProductsContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryFromUrl = searchParams.get('category') || 'all'

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl)
  const [sortBy, setSortBy] = useState<string>('name-asc')

  // Sync with URL params
  useEffect(() => {
    setSelectedCategory(categoryFromUrl)
  }, [categoryFromUrl])

  // Use custom hook to fetch products
  const { products, isLoading } = useProducts(selectedCategory)

  // Sort products client-side
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      default:
        return 0
    }
  })

  // Transform products for ProductCard
  const transformedProducts = sortedProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice || undefined,
    images: product.images.map((img: any) => ({
      image: {
        url: img.image?.url || '/placeholder-product.jpg',
        alt: img.image?.alt || product.name,
      },
    })),
    category: {
      name: product.category?.name || '',
      slug: product.category?.slug || '',
    },
    productType: product.productType,
    variants: product.variants?.map((v: any) => ({
      id: v.id || '',
      name: v.name,
      color: v.color || undefined,
      size: v.size || undefined,
      price: v.price,
      stock: v.stock,
    })),
    simpleStock: product.simpleStock || 0,
    featured: product.featured || false,
    status: product.status,
  }))

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {isLoading ? 'Cargando...' : `${transformedProducts.length} productos`}
              </span>
              {selectedCategory !== 'all' && (
                <Badge variant="secondary">
                  {categories.find((c) => c.id === selectedCategory)?.name || 'Categoría'}
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Categoría:
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value)
                    // Update URL
                    const params = new URLSearchParams()
                    if (value !== 'all') {
                      params.set('category', value)
                    }
                    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`)
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Ordenar:
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                    <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                    <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Cargando productos...</p>
            </div>
          </div>
        ) : transformedProducts.length > 0 ? (
          <ProductGrid>
            {transformedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500 mb-6">
              {selectedCategory !== 'all'
                ? 'No hay productos en esta categoría. Intenta con otra categoría.'
                : 'Pronto agregaremos productos. ¡Vuelve pronto!'}
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  router.push('/products')
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Ver todos los productos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
