import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCategories, getHomeContent, getFeaturedProducts } from '@/lib/payload'
import type { Category, Media } from '@/payload-types'
import HorizontalScroll from '@/components/ecommerce/HorizontalScroll'
import { ProductCard } from '@/components/ecommerce/ProductCard'
import { VideoSlider } from '@/components/ecommerce/VideoSlider'

export default async function Home() {
  const categoriesResult = await getCategories({ limit: 6 })
  const homeContent = await getHomeContent()
  const featuredProductsResult = homeContent.showFeaturedProducts
    ? await getFeaturedProducts(homeContent.featuredProductsLimit || 6)
    : null

  // Get hero media
  const heroMedia =
    homeContent.heroMediaType === 'video'
      ? (homeContent.heroVideo as Media | undefined)
      : (homeContent.heroImage as Media | undefined)
  const heroVideoFallback = homeContent.heroVideoFallback as Media | undefined
  console.log(homeContent.heroVideo)

  return (
    <main className="min-h-screen">
      {/* Video Slider Section - Dynamic from CMS */}
      {homeContent.videoSections && homeContent.videoSections.length > 0 && (
        <VideoSlider videos={homeContent.videoSections} />
      )}

      <HorizontalScroll />

      {/* Featured Products - Dynamic from CMS */}
      {homeContent.showFeaturedProducts &&
        featuredProductsResult &&
        featuredProductsResult.docs.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {homeContent.featuredProductsTitle || 'Productos Destacados'}
                </h2>
                {homeContent.featuredProductsSubtitle && (
                  <p className="text-muted-foreground">{homeContent.featuredProductsSubtitle}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProductsResult.docs.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* CTA Sections - Dynamic from CMS */}
      {homeContent.ctaSections?.map((section: any, index: number) => {
        const bgImage = section.backgroundImage as Media | undefined
        const isLight = section.textColor === 'light'

        return (
          <section
            key={index}
            className="relative py-24 md:py-32 overflow-hidden"
            style={{
              backgroundColor: bgImage ? undefined : section.backgroundColor || '#000',
            }}
          >
            {bgImage?.url && (
              <>
                <img
                  src={bgImage.url}
                  alt={section.title || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            )}
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                {section.title && (
                  <h2
                    className={`text-3xl md:text-5xl font-bold mb-4 ${
                      isLight || bgImage ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {section.title}
                  </h2>
                )}
                {section.description && (
                  <p
                    className={`text-lg md:text-xl mb-8 ${
                      isLight || bgImage ? 'text-white/90' : 'text-muted-foreground'
                    }`}
                  >
                    {section.description}
                  </p>
                )}
                {section.buttons && section.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {section.buttons.map((button: any, btnIndex: number) => (
                      <Link
                        key={btnIndex}
                        href={button.link || '#'}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-opacity hover:opacity-90 ${
                          button.variant === 'outline'
                            ? `border-2 ${isLight || bgImage ? 'border-white text-white' : 'border-foreground text-foreground'}`
                            : button.variant === 'secondary'
                              ? 'bg-muted text-foreground'
                              : 'bg-foreground text-background'
                        }`}
                      >
                        {button.text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      })}

      {/* Categorías destacadas */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Categories</h2>
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
    </main>
  )
}
