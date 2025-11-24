'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number
    images: Array<{ image: { url: string; alt?: string } }>
    category: { name: string; slug: string }
    productType: 'simple' | 'variable'
    variants?: Array<{
      id: string
      name: string
      color?: string
      size?: string
      price: number
      stock: number
    }>
    simpleStock?: number
    featured: boolean
    status: 'active' | 'inactive' | 'out_of_stock'
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const { addItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.productType === 'variable') {
      return
    }

    const cartItem = {
      id: `${product.id}-simple`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.image?.url || '',
    }

    addItem(cartItem)
    toast.success(`${product.name} added to cart`)
  }

  const isOutOfStock =
    product.status === 'out_of_stock' ||
    (product.productType === 'simple' && (product.simpleStock || 0) === 0) ||
    (product.productType === 'variable' && !product.variants?.some((v) => v.stock > 0))

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 border p-0 hover:translate-y-[-5px] hover:shadow-lg hover:scale-[1.01] bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.featured && (
            <Badge variant="default" className="bg-blue-600">
              Featured
            </Badge>
          )}
          {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
          {isOutOfStock && (
            <Badge variant="secondary" className="bg-gray-600">
              Out of Stock
            </Badge>
          )}
        </div>
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          <img
            src={product.images[imageIndex]?.image?.url || '/placeholder-product.jpg'}
            alt={product.images[imageIndex]?.image?.alt || product.name}
            className="w-full h-full object-cover"
          />

          {/* Additional Images Indicator */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {product.images.slice(0, 3).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === imageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onMouseEnter={() => setImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-xs text-gray-500 hover:text-gray-700 uppercase tracking-wide"
          >
            {product.category.name}
          </Link>

          {/* Product Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 mt-1 mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {product.productType === 'simple' && (
            <Button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </CardContent>
      </Link>
      {/* Badges */}
    </Card>
  )
}
