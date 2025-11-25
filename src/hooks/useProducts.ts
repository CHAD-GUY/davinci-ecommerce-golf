import { useQuery } from '@tanstack/react-query'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: any[]
  category: any
  productType: 'simple' | 'variable'
  variants?: any[]
  simpleStock?: number
  featured: boolean
  status: string
}

interface ProductsResponse {
  docs: Product[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}

async function fetchProducts(category?: string): Promise<ProductsResponse> {
  const params = new URLSearchParams()
  if (category && category !== 'all') {
    params.append('category', category)
  }

  const response = await fetch(`/api/frontend-products?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

export function useProducts(category?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', category || 'all'],
    queryFn: () => fetchProducts(category),
  })

  return {
    products: data?.docs || [],
    totalProducts: data?.totalDocs || 0,
    isLoading,
    error,
    refetch,
  }
}
