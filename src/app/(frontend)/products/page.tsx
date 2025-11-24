import { Suspense } from 'react'
import { ProductsContent } from '@/components/ecommerce/ProductsContent'
import { getCategories } from '@/lib/payload'

export default async function ProductsPage() {
  const categoriesResult = await getCategories()

  const categories = categoriesResult.docs.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }))

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <ProductsContent categories={categories} />
    </Suspense>
  )
}
