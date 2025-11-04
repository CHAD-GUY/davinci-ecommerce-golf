import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Users, Award, Truck, Leaf, Globe } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: 'Pasión por la Calidad',
      description: 'Seleccionamos cada producto con cuidado para garantizar la mejor calidad para nuestros clientes.',
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: 'Comunidad',
      description: 'Creemos en construir una comunidad sólida donde cada cliente se sienta valorado y especial.',
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      title: 'Excelencia',
      description: 'Nos esforzamos por la excelencia en cada aspecto de nuestro negocio, desde productos hasta servicio.',
    },
    {
      icon: <Truck className="w-8 h-8 text-green-500" />,
      title: 'Entrega Rápida',
      description: 'Garantizamos entregas rápidas y seguras para que disfrutes tus productos lo antes posible.',
    },
    {
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      title: 'Sostenibilidad',
      description: 'Comprometidos con prácticas sostenibles y productos eco-friendly para cuidar nuestro planeta.',
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-500" />,
      title: 'Alcance Global',
      description: 'Desde Argentina hacia el mundo, llevamos productos únicos a cualquier lugar donde estés.',
    },
  ]

  const team = [
    {
      name: 'María García',
      role: 'CEO & Fundadora',
      image: '/placeholder-product.jpg',
      description: 'Visionaria con 15 años de experiencia en e-commerce y retail.',
    },
    {
      name: 'Carlos Rodriguez',
      role: 'Director de Producto',
      image: '/placeholder-product.jpg',
      description: 'Experto en curación de productos y tendencias de mercado.',
    },
    {
      name: 'Ana Martinez',
      role: 'Head de Marketing',
      image: '/placeholder-product.jpg',
      description: 'Especialista en marketing digital y experiencia del cliente.',
    },
    {
      name: 'Diego López',
      role: 'Director Técnico',
      image: '/placeholder-product.jpg',
      description: 'Ingeniero con pasión por crear las mejores soluciones tecnológicas.',
    },
  ]

  const stats = [
    { value: '50K+', label: 'Clientes Satisfechos' },
    { value: '1000+', label: 'Productos Únicos' },
    { value: '98%', label: 'Satisfacción del Cliente' },
    { value: '5⭐', label: 'Calificación Promedio' },
  ]

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-white text-blue-600">Nuestra Historia</Badge>
            <h1 className="text-5xl font-bold mb-6">Acerca de Davinci Store</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Desde 2019, hemos estado comprometidos con brindar productos únicos y de alta calidad, 
              combinando estilo, funcionalidad y valores que nos definen como empresa.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/contact">Contacta con Nosotros</Link>
            </Button>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Todo comenzó en 2019 cuando María García, nuestra fundadora, se dio cuenta de que 
                    faltaba algo en el mercado online argentino: una tienda que combinara productos 
                    de moda de calidad con artículos únicos para el hogar.
                  </p>
                  <p>
                    Con una visión clara de crear una experiencia de compra excepcional, Davinci Store 
                    nació como un proyecto familiar que rápidamente creció hasta convertirse en la 
                    tienda online de confianza que conoces hoy.
                  </p>
                  <p>
                    Desde nuestros humildes comienzos en Buenos Aires, hemos expandido nuestro 
                    catálogo y mejorado constantemente nuestra plataforma para ofrecer la mejor 
                    experiencia de compra online.
                  </p>
                  <p>
                    Hoy, con más de 50,000 clientes satisfechos y un equipo apasionado, seguimos 
                    comprometidos con nuestra misión original: hacer que cada compra sea especial.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/placeholder-product.jpg"
                  alt="Equipo Davinci Store"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                  <div className="text-3xl font-bold text-blue-600">5+</div>
                  <div className="text-gray-600 font-medium">Años de Experiencia</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Números que Hablan por Sí Solos</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Estos números reflejan nuestro compromiso con la excelencia y la satisfacción de nuestros clientes.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Los principios que guían cada decisión que tomamos y definen quiénes somos como empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Conoce a las personas apasionadas que hacen posible la magia de Davinci Store cada día.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <div className="text-blue-600 font-medium mb-3">{member.role}</div>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Nuestra Misión</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              "Hacer que cada persona pueda expresar su personalidad única a través de productos 
              cuidadosamente seleccionados, brindando una experiencia de compra excepcional que 
              supere las expectativas y construya relaciones duraderas con nuestros clientes."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/products">Explorar Productos</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Link href="/contact">Contáctanos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">¿Quieres Ser Parte de Nuestra Historia?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Únete a nuestra comunidad de clientes satisfechos y descubre por qué somos la opción 
                preferida para productos únicos y de calidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/products">Comenzar a Comprar</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/newsletter">Suscribirse al Newsletter</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}