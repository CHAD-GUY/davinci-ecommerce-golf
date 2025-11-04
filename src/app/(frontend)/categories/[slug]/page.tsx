'use client'

import { use } from 'react'
import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { ProductGrid } from '@/components/ecommerce/ProductGrid'
import { ProductCard } from '@/components/ecommerce/ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search, Filter, Grid, List, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock categories and products data
const mockCategories = {
  'remeras': {
    id: '1',
    name: 'Remeras',
    slug: 'remeras',
    description: 'Descubre nuestra colección de remeras básicas y deportivas de alta calidad. Perfectas para cualquier ocasión, disponibles en diferentes colores y tallas.',
    image: '/placeholder-product.jpg',
    productCount: 24,
    products: [
      {
        id: '1',
        name: 'Remera Básica Algodón',
        slug: 'remera-basica-algodon',
        price: 12999,
        compareAtPrice: 15999,
        images: [{ image: { url: '/placeholder-product.jpg', alt: 'Remera básica' } }],
        category: { name: 'Remeras', slug: 'remeras' },
        productType: 'variable' as const,
        variants: [
          { id: '1-1', name: 'Roja M', color: 'Roja', size: 'm', price: 12999, stock: 5 },
          { id: '1-2', name: 'Azul L', color: 'Azul', size: 'l', price: 12999, stock: 3 },
        ],
        featured: true,
        status: 'active' as const,
      },
      {
        id: '3',
        name: 'Remera Deportiva Premium',
        slug: 'remera-deportiva-premium',
        price: 18999,
        compareAtPrice: 22999,
        images: [{ image: { url: '/placeholder-product.jpg', alt: 'Remera deportiva' } }],
        category: { name: 'Remeras', slug: 'remeras' },
        productType: 'variable' as const,
        variants: [
          { id: '3-1', name: 'Negro S', color: 'Negro', size: 's', price: 18999, stock: 10 },
          { id: '3-2', name: 'Negro M', color: 'Negro', size: 'm', price: 18999, stock: 8 },
        ],
        featured: false,
        status: 'active' as const,
      },
      {
        id: '5',
        name: 'Remera Oversized',
        slug: 'remera-oversized',
        price: 16999,
        images: [{ image: { url: '/placeholder-product.jpg', alt: 'Remera oversized' } }],
        category: { name: 'Remeras', slug: 'remeras' },
        productType: 'variable' as const,
        variants: [
          { id: '5-1', name: 'Gris L', color: 'Gris', size: 'l', price: 16999, stock: 12 },
          { id: '5-2', name: 'Gris XL', color: 'Gris', size: 'xl', price: 16999, stock: 8 },
        ],
        featured: false,
        status: 'active' as const,
      },
      {
        id: '7',
        name: 'Remera Estampada',
        slug: 'remera-estampada',
        price: 14999,
        images: [{ image: { url: '/placeholder-product.jpg', alt: 'Remera estampada' } }],
        category: { name: 'Remeras', slug: 'remeras' },
        productType: 'variable' as const,
        variants: [
          { id: '7-1', name: 'Blanca S', color: 'Blanca', size: 's', price: 14999, stock: 6 },
          { id: '7-2', name: 'Blanca M', color: 'Blanca', size: 'm', price: 14999, stock: 4 },
        ],
        featured: false,
        status: 'active' as const,
      },
    ]
  },
  'decoracion': {
    id: '2',
    name: 'Decoración',
    slug: 'decoracion',
    description: 'Transforma tu hogar con nuestra exclusiva colección de productos decorativos. Desde jarrones hasta lámparas, cada pieza está cuidadosamente seleccionada.',
    image: '/placeholder-product.jpg',
    productCount: 18,
    products: [
      {
        id: '2',
        name: 'Jarrón Decorativo Moderno',
        slug: 'jarron-decorativo-moderno',
        price: 89999,
        images: [{ image: { url: '/placeholder-product.jpg', alt: 'Jarrón decorativo' } }],
        category: { name: 'Decoración', slug: 'decoracion' },
        productType: 'simple' as const,
        simpleStock: 2,
        featured: true,
        status: 'active' as const,
      },
      {
        id: '4',
        name: 'Lámpara de Mesa Vintage',
        slug: 'lampara-mesa-vintage',
        price: 45999,
        images: [{ image: { url: '/placeholder-product.jpg', alt: 'Lámpara vintage' } }],
        category: { name: 'Decoración', slug: 'decoracion' },
        productType: 'simple' as const,
        simpleStock: 0,
        featured: false,
        status: 'out_of_stock' as const,
      },
      {
        id: '6',
        name: 'Espejo Decorativo Redondo',
        slug: 'espejo-decorativo-redondo',
        price: 32999,
        compareAtPrice: 39999,
        images: [{ image: { url: '/placeholder-product.jpg', alt: 'Espejo decorativo' } }],
        category: { name: 'Decoración', slug: 'decoracion' },
        productType: 'simple' as const,
        simpleStock: 4,
        featured: false,
        status: 'active' as const,
      },
      {
        id: '8',
        name: 'Florero de Cristal',
        slug: 'florero-cristal',
        price: 24999,
        images: [{ image: { url: '/placeholder-product.jpg', alt: 'Florero de cristal' } }],
        category: { name: 'Decoración', slug: 'decoracion' },
        productType: 'simple' as const,
        simpleStock: 7,
        featured: false,
        status: 'active' as const,
      },
    ]
  },
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params)
  const category = mockCategories[resolvedParams.slug as keyof typeof mockCategories]

  if (!category) {
    notFound()
  }

  const availableProducts = category.products.filter(p => p.status === 'active')
  const outOfStockProducts = category.products.filter(p => p.status === 'out_of_stock')

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">Inicio</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-gray-900">Categorías</Link>
              <span>/</span>
              <span className="text-gray-900">{category.name}</span>
            </div>
          </div>
        </div>

        {/* Category Header */}
        <section className="bg-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <Link href="/categories" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Categorías
                </Link>
                <Badge className="mb-4 bg-blue-600">{category.productCount} productos</Badge>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
                <p className="text-lg text-gray-600 mb-6">{category.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline">Calidad Premium</Badge>
                  <Badge variant="outline">Envío Gratis</Badge>
                  <Badge variant="outline">Garantía Incluida</Badge>
                </div>
              </div>
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="rounded-2xl shadow-xl w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </h2>
                
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Buscar en {category.name}</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="search"
                        placeholder="Buscar productos..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rango de Precio</label>
                    <div className="space-y-2">
                      <Input type="number" placeholder="Precio mínimo" />
                      <Input type="number" placeholder="Precio máximo" />
                    </div>
                  </div>

                  {/* Colors (for Remeras) */}
                  {category.slug === 'remeras' && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Colores</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Rojo</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Azul</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Negro</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Blanco</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Sizes (for Remeras) */}
                  {category.slug === 'remeras' && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tallas</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <label key={size} className="flex items-center justify-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                            <input type="checkbox" className="sr-only" />
                            <span className="text-sm font-medium">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Disponibilidad</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">En stock ({availableProducts.length})</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Sin stock ({outOfStockProducts.length})</span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full">Aplicar Filtros</Button>
                </div>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Mostrando {category.products.length} productos
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    {category.name}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destacados</SelectItem>
                      <SelectItem value="newest">Más nuevos</SelectItem>
                      <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                      <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                      <SelectItem value="name">Nombre A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="flex items-center border rounded-lg p-1">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 opacity-50">
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <ProductGrid>
                {category.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductGrid>

              {/* Empty State */}
              {category.products.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay productos en esta categoría
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Pronto agregaremos más productos. ¡Mantente atento!
                  </p>
                  <Button asChild>
                    <Link href="/products">
                      Ver Todos los Productos
                    </Link>
                  </Button>
                </div>
              )}

              {/* Load More */}
              {category.products.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Cargar Más Productos
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Related Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Otras Categorías que te Pueden Interesar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {Object.values(mockCategories)
                .filter(cat => cat.slug !== category.slug)
                .map((otherCategory) => (
                  <Link key={otherCategory.id} href={`/categories/${otherCategory.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                      <div className="p-6 text-center">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {otherCategory.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {otherCategory.description}
                        </p>
                        <Badge variant="outline">
                          {otherCategory.productCount} productos
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}