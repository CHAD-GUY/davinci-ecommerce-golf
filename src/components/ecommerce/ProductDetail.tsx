'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Truck, Shield, RefreshCw, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ProductDetailProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number
    description: string
    images: Array<{ url: string; alt: string }>
    category: { name: string; slug: string }
    productType: 'simple' | 'variable'
    variants?: Array<{
      id: string
      name: string
      color?: string
      size?: string
      price: number
      stock: number
      sku: string
      image?: { url: string; alt?: string }
    }>
    simpleStock?: number
    featured: boolean
    status: string
    tags?: string[]
    sku?: string
  }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)

  useEffect(() => {
    if (product.productType === 'variable' && product.variants) {
      // Set default selections
      const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
      const firstColor = colors[0]
      if (firstColor) {
        setSelectedColor(firstColor)

        // Find first available size for this color
        const sizesForColor = product.variants
          .filter((v) => v.color === firstColor)
          .map((v) => v.size)
          .filter(Boolean)

        if (sizesForColor.length > 0) {
          setSelectedSize(sizesForColor[0]!)
        }
      }
    }
  }, [product])

  useEffect(() => {
    if (product.productType === 'variable' && selectedColor && selectedSize) {
      const variant = product.variants?.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      )
      setSelectedVariant(variant || null)
      // Reset image index when variant changes
      if (variant) {
        setSelectedImageIndex(0)
      }
    }
  }, [selectedColor, selectedSize, product])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const availableColors =
    product.productType === 'variable'
      ? [...new Set(product.variants?.map((v) => v.color).filter(Boolean))]
      : []

  console.log(availableColors)

  const availableSizes =
    product.productType === 'variable' && selectedColor
      ? product.variants
          ?.filter((v) => v.color === selectedColor)
          .map((v) => v.size)
          .filter(Boolean)
      : []

  const currentStock =
    product.productType === 'simple' ? product.simpleStock || 0 : selectedVariant?.stock || 0

  const isOutOfStock = currentStock === 0

  // Determine which images to show: variant image or product images
  const displayImages = selectedVariant?.image ? [selectedVariant.image] : product.images

  const handleAddToCart = () => {
    if (product.productType === 'variable') {
      if (!selectedVariant) {
        toast.error('Por favor selecciona color y talla')
        return
      }

      const cartItem = {
        id: `${product.id}-${selectedVariant.id}`,
        productId: product.id,
        name: product.name,
        price: selectedVariant.price,
        image: product.images[0]?.url || '',
        quantity,
        variant: {
          id: selectedVariant.id,
          name: selectedVariant.name,
          color: selectedVariant.color,
          size: selectedVariant.size,
          price: selectedVariant.price,
        },
      }

      addItem(cartItem)
      toast.success(
        `${quantity}x ${product.name} (${selectedVariant.color} - ${selectedVariant.size?.toUpperCase()}) agregado al carrito`,
      )
    } else {
      const cartItem = {
        id: `${product.id}-simple`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '',
        quantity,
      }

      addItem(cartItem)
      toast.success(`${quantity}x ${product.name} agregado al carrito`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
              <img
                src={displayImages[selectedImageIndex]?.url || '/placeholder-product.jpg'}
                alt={displayImages[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-foreground'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 py-2">
              <span className="text-3xl md:text-4xl font-bold text-foreground">
                {formatPrice(selectedVariant?.price || product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    -{discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Variants Selection */}
            {product.productType === 'variable' && (
              <div className="space-y-5 py-2">
                {/* Color Selection */}
                {availableColors.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-3">Color</label>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color!)
                            // Reset size selection when color changes
                            const sizesForColor = product.variants
                              ?.filter((v) => v.color === color)
                              .map((v) => v.size)
                              .filter(Boolean)
                            if (sizesForColor && sizesForColor.length > 0) {
                              setSelectedSize(sizesForColor[0]!)
                            }
                          }}
                          className="relative group"
                          title={color}
                        >
                          <div
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                              selectedColor === color
                                ? 'border-foreground scale-110 shadow-lg'
                                : 'border-border hover:border-muted-foreground hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {selectedColor === color && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full shadow-md" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {availableSizes && availableSizes.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-3">
                      Talla:{' '}
                      <span className="font-normal text-muted-foreground">
                        {selectedSize?.toUpperCase()}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => {
                        const variant = product.variants?.find(
                          (v) => v.color === selectedColor && v.size === size,
                        )
                        const sizeOutOfStock = !variant || variant.stock === 0

                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size!)}
                            disabled={sizeOutOfStock}
                            className={`px-5 py-2.5 rounded-md border-2 text-sm font-medium transition-all ${
                              selectedSize === size
                                ? 'border-foreground bg-foreground text-background'
                                : sizeOutOfStock
                                  ? 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                  : 'border-border bg-background text-foreground hover:border-muted-foreground'
                            }`}
                          >
                            {size?.toUpperCase()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Stock */}
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Cantidad</label>
                <span className="text-sm text-muted-foreground">
                  Stock: <span className="font-medium text-foreground">{currentStock}</span>{' '}
                  {currentStock === 1 ? 'unidad' : 'unidades'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-11 w-11 p-0 rounded-none hover:bg-muted"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-14 text-center font-semibold text-foreground">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="h-11 w-11 p-0 rounded-none hover:bg-muted"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || (product.productType === 'variable' && !selectedVariant)}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isOutOfStock
                  ? 'Sin Stock'
                  : `Agregar - ${formatPrice((selectedVariant?.price || product.price) * quantity)}`}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  <Truck className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">Envío Gratis</div>
                  <div className="text-muted-foreground">Desde $50,000</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  <Shield className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">Compra Segura</div>
                  <div className="text-muted-foreground">Pagos protegidos</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  <RefreshCw className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">Devoluciones</div>
                  <div className="text-muted-foreground">30 días</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Descripción</h2>
          </div>

          <Card className="p-6 border">
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {product.tags && product.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-foreground mb-3">Etiquetas:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
