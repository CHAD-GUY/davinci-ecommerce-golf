import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { ProductGrid } from '@/components/ecommerce/ProductGrid'
import { ProductCard } from '@/components/ecommerce/ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search, Filter, Grid, List } from 'lucide-react'

// Mock data - in a real app, this would come from your CMS API
const mockProducts = [
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
      { id: '3-3', name: 'Blanco S', color: 'Blanco', size: 's', price: 18999, stock: 6 },
    ],
    featured: false,
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
]

const categories = [
  { name: 'Todas las categorías', value: 'all' },
  { name: 'Remeras', value: 'remeras' },
  { name: 'Decoración', value: 'decoracion' },
]

export default function ProductsPage() {
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos los Productos</h1>
            <p className="text-gray-600">Descubre nuestra completa colección de productos</p>
          </div>
        </div>

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
                    <label className="text-sm font-medium mb-2 block">Buscar</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="search"
                        placeholder="Buscar productos..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoría</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rango de Precio</label>
                    <div className="space-y-2">
                      <Input type="number" placeholder="Precio mínimo" />
                      <Input type="number" placeholder="Precio máximo" />
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Disponibilidad</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">En stock</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Sin stock</span>
                      </label>
                    </div>
                  </div>

                  {/* Product Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Producto</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Productos simples</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Con variantes</span>
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
                    Mostrando {mockProducts.length} productos
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    Todos
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
                {mockProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductGrid>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button variant="outline" disabled>
                  Anterior
                </Button>
                <Button className="bg-blue-600">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">
                  Siguiente
                </Button>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}