import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock categories data
const mockCategories = [
  {
    id: '1',
    name: 'Remeras',
    slug: 'remeras',
    description: 'Remeras básicas y deportivas de alta calidad en diferentes colores y tallas.',
    image: '/placeholder-product.jpg',
    productCount: 24,
    featured: true,
  },
  {
    id: '2',
    name: 'Decoración',
    slug: 'decoracion',
    description: 'Productos decorativos únicos para embellecer tu hogar con estilo moderno.',
    image: '/placeholder-product.jpg',
    productCount: 18,
    featured: true,
  },
  {
    id: '3',
    name: 'Pantalones',
    slug: 'pantalones',
    description: 'Pantalones casuales y formales para todas las ocasiones.',
    image: '/placeholder-product.jpg',
    productCount: 15,
    featured: false,
  },
  {
    id: '4',
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Complementa tu look con nuestros accesorios únicos.',
    image: '/placeholder-product.jpg',
    productCount: 32,
    featured: false,
  },
  {
    id: '5',
    name: 'Hogar',
    slug: 'hogar',
    description: 'Artículos esenciales para hacer de tu casa un hogar.',
    image: '/placeholder-product.jpg',
    productCount: 21,
    featured: false,
  },
  {
    id: '6',
    name: 'Electrónicos',
    slug: 'electronicos',
    description: 'Gadgets y dispositivos electrónicos de última tecnología.',
    image: '/placeholder-product.jpg',
    productCount: 8,
    featured: false,
  },
]

export default function CategoriesPage() {
  const featuredCategories = mockCategories.filter(cat => cat.featured)
  const otherCategories = mockCategories.filter(cat => !cat.featured)

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Categorías</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora nuestra amplia selección de productos organizados por categorías para encontrar exactamente lo que buscas.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Featured Categories */}
          {featuredCategories.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Categorías Destacadas</h2>
                <Badge className="bg-blue-600">Popular</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredCategories.map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                          <Badge className="w-fit mb-3 bg-blue-600">Destacado</Badge>
                          <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                          <p className="text-gray-200 mb-3">{category.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {category.productCount} productos
                            </span>
                            <span className="text-sm font-medium group-hover:underline">
                              Ver más →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Categories */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Todas las Categorías</h2>
              <span className="text-gray-600">{mockCategories.length} categorías disponibles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {otherCategories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          {category.productCount} productos
                        </span>
                        <span className="text-sm font-medium text-blue-600 group-hover:underline">
                          Explorar
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Contáctanos y te ayudaremos a encontrar el producto perfecto para ti. 
              Nuestro equipo está siempre dispuesto a asistirte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contactar Soporte
              </Link>
              <Link 
                href="/products"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                Ver Todos los Productos
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  )
}