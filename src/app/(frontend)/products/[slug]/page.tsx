'use client'

import { useState, useEffect, use } from 'react'
import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/contexts/CartContext'
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Truck, Shield, RefreshCw, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { notFound } from 'next/navigation'

// Mock data - in a real app, this would come from your CMS
const mockProducts = {
  'remera-basica-algodon': {
    id: '1',
    name: 'Remera Básica Algodón',
    slug: 'remera-basica-algodon',
    price: 12999,
    compareAtPrice: 15999,
    description: '<p>Esta remera básica de algodón 100% es perfecta para el uso diario. Confeccionada con materiales de alta calidad, ofrece comodidad y durabilidad excepcionales.</p><p>Características:</p><ul><li>100% Algodón premium</li><li>Corte regular</li><li>Cuello redondo</li><li>Mangas cortas</li><li>Fácil cuidado - lavable en máquina</li></ul>',
    images: [
      { image: { url: '/placeholder-product.jpg', alt: 'Remera básica roja' } },
      { image: { url: '/placeholder-product.jpg', alt: 'Remera básica azul' } },
      { image: { url: '/placeholder-product.jpg', alt: 'Detalle del cuello' } },
      { image: { url: '/placeholder-product.jpg', alt: 'Vista posterior' } },
    ],
    category: { name: 'Remeras', slug: 'remeras' },
    productType: 'variable' as const,
    variants: [
      { id: '1-1', name: 'Roja M', color: 'Roja', size: 'm', price: 12999, stock: 5, sku: 'REM-ROJ-M' },
      { id: '1-2', name: 'Roja L', color: 'Roja', size: 'l', price: 12999, stock: 3, sku: 'REM-ROJ-L' },
      { id: '1-3', name: 'Roja XL', color: 'Roja', size: 'xl', price: 12999, stock: 2, sku: 'REM-ROJ-XL' },
      { id: '1-4', name: 'Azul M', color: 'Azul', size: 'm', price: 12999, stock: 4, sku: 'REM-AZU-M' },
      { id: '1-5', name: 'Azul L', color: 'Azul', size: 'l', price: 12999, stock: 6, sku: 'REM-AZU-L' },
      { id: '1-6', name: 'Azul XL', color: 'Azul', size: 'xl', price: 12999, stock: 1, sku: 'REM-AZU-XL' },
      { id: '1-7', name: 'Blanca M', color: 'Blanca', size: 'm', price: 12999, stock: 8, sku: 'REM-BLA-M' },
      { id: '1-8', name: 'Blanca L', color: 'Blanca', size: 'l', price: 12999, stock: 5, sku: 'REM-BLA-L' },
    ],
    featured: true,
    status: 'active' as const,
    tags: ['algodón', 'básico', 'casual', 'unisex'],
    rating: 4.5,
    reviewCount: 127,
  },
  'jarron-decorativo-moderno': {
    id: '2',
    name: 'Jarrón Decorativo Moderno',
    slug: 'jarron-decorativo-moderno',
    price: 89999,
    description: '<p>Jarrón decorativo de cerámica con acabado mate y diseño contemporáneo. Perfecto para decorar cualquier espacio de tu hogar.</p><p>Especificaciones:</p><ul><li>Material: Cerámica de alta calidad</li><li>Altura: 35cm</li><li>Diámetro: 15cm</li><li>Acabado mate</li><li>Diseño minimalista</li><li>Apto para flores secas y artificiales</li></ul>',
    images: [
      { image: { url: '/placeholder-product.jpg', alt: 'Jarrón decorativo' } },
      { image: { url: '/placeholder-product.jpg', alt: 'Vista lateral' } },
      { image: { url: '/placeholder-product.jpg', alt: 'Detalle textura' } },
    ],
    category: { name: 'Decoración', slug: 'decoracion' },
    productType: 'simple' as const,
    simpleStock: 2,
    featured: true,
    status: 'active' as const,
    tags: ['decoración', 'cerámica', 'moderno', 'hogar'],
    rating: 4.8,
    reviewCount: 43,
    sku: 'JAR-MOD-001',
  },
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params)
  const { addItem } = useCart()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)

  const product = mockProducts[resolvedParams.slug as keyof typeof mockProducts]

  useEffect(() => {
    if (product && product.productType === 'variable') {
      // Set default selections
      const colors = [...new Set(product.variants?.map(v => v.color))]
      const firstColor = colors[0]
      if (firstColor) {
        setSelectedColor(firstColor)
        
        // Find first available size for this color
        const sizesForColor = product.variants
          ?.filter(v => v.color === firstColor)
          .map(v => v.size)
        
        if (sizesForColor && sizesForColor.length > 0) {
          setSelectedSize(sizesForColor[0])
        }
      }
    }
  }, [product])

  useEffect(() => {
    if (product && product.productType === 'variable' && selectedColor && selectedSize) {
      const variant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize)
      setSelectedVariant(variant || null)
    }
  }, [selectedColor, selectedSize, product])

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const availableColors = product.productType === 'variable'
    ? [...new Set(product.variants?.map(v => v.color))]
    : []

  const availableSizes = product.productType === 'variable' && selectedColor
    ? product.variants?.filter(v => v.color === selectedColor).map(v => v.size)
    : []

  const currentStock = product.productType === 'simple' 
    ? product.simpleStock 
    : selectedVariant?.stock || 0

  const isOutOfStock = currentStock === 0

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
        image: product.images[0]?.image?.url || '',
        variant: {
          id: selectedVariant.id,
          name: selectedVariant.name,
          color: selectedVariant.color,
          size: selectedVariant.size,
          price: selectedVariant.price,
        }
      }

      addItem(cartItem, quantity)
      toast.success(`${quantity}x ${product.name} (${selectedVariant.color} - ${selectedVariant.size?.toUpperCase()}) agregado al carrito`)
    } else {
      const cartItem = {
        id: `${product.id}-simple`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.image?.url || '',
      }

      addItem(cartItem, quantity)
      toast.success(`${quantity}x ${product.name} agregado al carrito`)
    }
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">Inicio</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-gray-900">Productos</Link>
              <span>/</span>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-gray-900">
                {product.category.name}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImageIndex]?.image?.url || '/placeholder-product.jpg'}
                  alt={product.images[selectedImageIndex]?.image?.alt || product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        index === selectedImageIndex ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.image.url}
                        alt={img.image.alt || `${product.name} ${index + 1}`}
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
                <Link href={`/categories/${product.category.slug}`} className="text-sm text-blue-600 hover:text-blue-700">
                  {product.category.name}
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reseñas)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(selectedVariant?.price || product.price)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
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
                <div className="space-y-4">
                  {/* Color Selection */}
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-2">
                      Color: <span className="font-normal">{selectedColor}</span>
                    </label>
                    <div className="flex gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color)
                            // Reset size selection when color changes
                            const sizesForColor = product.variants
                              ?.filter(v => v.color === color)
                              .map(v => v.size)
                            if (sizesForColor && sizesForColor.length > 0) {
                              setSelectedSize(sizesForColor[0])
                            }
                          }}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium ${
                            selectedColor === color
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-2">
                      Talla: <span className="font-normal">{selectedSize?.toUpperCase()}</span>
                    </label>
                    <div className="flex gap-2">
                      {availableSizes?.map((size) => {
                        const variant = product.variants?.find(v => v.color === selectedColor && v.size === size)
                        const sizeOutOfStock = !variant || variant.stock === 0
                        
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            disabled={sizeOutOfStock}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium ${
                              selectedSize === size
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : sizeOutOfStock
                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {size?.toUpperCase()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity and Stock */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">Cantidad</label>
                  <span className="text-sm text-gray-600">
                    Stock disponible: {currentStock}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || (product.productType === 'variable' && !selectedVariant)}
                  className="w-full h-12 text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOutOfStock ? 'Sin Stock' : `Agregar al Carrito - ${formatPrice((selectedVariant?.price || product.price) * quantity)}`}
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritos
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium">Envío Gratis</div>
                    <div className="text-gray-500">Desde $50,000</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div className="text-sm">
                    <div className="font-medium">Compra Segura</div>
                    <div className="text-gray-500">Pagos protegidos</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-orange-600" />
                  <div className="text-sm">
                    <div className="font-medium">Devoluciones</div>
                    <div className="text-gray-500">30 días</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Descripción</TabsTrigger>
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas ({product.reviewCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <Card className="p-6">
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Etiquetas:</h4>
                      <div className="flex gap-2">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="specs" className="mt-6">
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-3">Información del Producto</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="font-medium">SKU:</dt>
                          <dd>{selectedVariant?.sku || (product.productType === 'simple' ? product.sku : 'N/A')}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Categoría:</dt>
                          <dd>{product.category.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Tipo:</dt>
                          <dd>{product.productType === 'simple' ? 'Producto Simple' : 'Producto con Variantes'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium">Stock:</dt>
                          <dd>{currentStock} unidades</dd>
                        </div>
                      </dl>
                    </div>
                    
                    {product.productType === 'variable' && selectedVariant && (
                      <div>
                        <h4 className="font-medium mb-3">Variante Seleccionada</h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="font-medium">Color:</dt>
                            <dd>{selectedVariant.color}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Talla:</dt>
                            <dd>{selectedVariant.size?.toUpperCase()}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Precio:</dt>
                            <dd>{formatPrice(selectedVariant.price)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Stock:</dt>
                            <dd>{selectedVariant.stock} unidades</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <Card className="p-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sistema de Reseñas</h3>
                    <p className="text-gray-500 mb-4">
                      Las reseñas de productos estarán disponibles próximamente.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium">{product.rating}</span>
                      <span className="text-gray-500">({product.reviewCount} reseñas)</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}