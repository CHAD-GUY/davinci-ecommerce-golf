import { useQuery } from '@tanstack/react-query'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: any
}

interface CategoriesResponse {
  docs: Category[]
  totalDocs: number
}

async function fetchCategories(): Promise<CategoriesResponse> {
  const response = await fetch('/api/categories')
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
  })

  return {
    categories: data?.docs || [],
    isLoading,
    error,
  }
}
