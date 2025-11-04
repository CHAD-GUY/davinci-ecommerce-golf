'use client'

import { ReactNode } from 'react'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface CartDrawerProps {
  children: ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { cart, updateQuantity, removeItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito de Compras
            {cart.itemCount > 0 && (
              <Badge variant="secondary">{cart.itemCount}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-6">
                Agrega algunos productos para comenzar
              </p>
              <Button asChild>
                <Link href="/products">
                  Explorar Productos
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.variant.color && `Color: ${item.variant.color}`}
                          {item.variant.color && item.variant.size && ' • '}
                          {item.variant.size && `Talla: ${item.variant.size.toUpperCase()}`}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-7 h-7 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-7 h-7 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-7 h-7 p-0 ml-2 text-red-500 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Cart Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">
                      Finalizar Compra
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/cart">
                      Ver Carrito Completo
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Envío gratis en compras superiores a $50,000
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}