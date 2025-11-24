import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCategories, getCoupons } from '@/lib/payload'
import type { Category, Media } from '@/payload-types'

export default async function Home() {
  const categoriesResult = await getCategories({ limit: 6 })
  const couponsResult = await getCoupons()

  const featuredCoupon = couponsResult.docs[0] // Get the first active coupon
  return (
    <main className="min-h-screen">
      {/* Hero Section - Minimalista */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Descubrí tu estilo
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Moda y accesorios para cada momento. Envíos a todo el país.
          </p>
          <div className="flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Ver productos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cupón destacado */}
      {featuredCoupon && (
        <section className="bg-accent/10 border-y">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">OFERTA ESPECIAL</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {featuredCoupon.discountType === 'percentage'
                  ? `${featuredCoupon.discountValue}% de descuento`
                  : `$${featuredCoupon.discountValue} de descuento`}
                {featuredCoupon.description && ` - ${featuredCoupon.description}`}
              </h2>
              <div className="inline-flex items-center gap-3 bg-background border-2 border-dashed border-foreground px-6 py-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Usá el código:</span>
                <code className="text-xl font-mono font-bold">{featuredCoupon.code}</code>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categorías destacadas */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explorá por categoría</h2>
            <p className="text-muted-foreground">Encontrá lo que buscás en nuestras colecciones</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesResult.docs.map((category: Category) => {
              const media = category.image as Media | null
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  {media?.url && (
                    <img
                      src={media.url}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-semibold text-white group-hover:scale-105 transition-transform">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Descubre nuestra colección</h2>
          <p className="text-background/80 mb-8 max-w-2xl mx-auto">
            Encuentra los productos perfectos para tu estilo
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Ver productos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
