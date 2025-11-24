'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/CartContext'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Tag, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)
  }

  // Calculate discount
  let discountAmount = 0
  if (cart.coupon) {
    if (cart.coupon.discountType === 'percentage') {
      discountAmount = Math.round((cart.total * cart.coupon.discountValue) / 100)
    } else if (cart.coupon.discountType === 'fixed') {
      discountAmount = cart.coupon.discountValue
    }
  }

  // Calculate shipping (free if over 50000 or coupon applies)
  const isFreeShipping = cart.total > 50000 || cart.coupon?.discountType === 'free_shipping'
  const shippingCost = isFreeShipping ? 0 : 5000

  const tax = Math.round(cart.total * 0.21) // 21% IVA
  const finalTotal = cart.total - discountAmount + shippingCost + tax

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setIsApplyingCoupon(true)

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          cartTotal: cart.total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Invalid coupon')
        return
      }

      if (data.valid && data.coupon) {
        applyCoupon(data.coupon)
        toast.success('Coupon applied successfully!')
        setCouponCode('')
      } else {
        toast.error('Invalid coupon')
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast.error('Error applying coupon')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast.success('Coupon removed')
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">
            {cart.itemCount} {cart.itemCount === 1 ? 'product' : 'products'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {cart.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>

                          {item.variant && (
                            <div className="flex gap-2 mb-2">
                              {item.variant.color && (
                                <Badge variant="outline" className="text-xs">
                                  {item.variant.color}
                                </Badge>
                              )}
                              {item.variant.size && (
                                <Badge variant="outline" className="text-xs">
                                  Size: {item.variant.size.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1 border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-12 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatPrice(item.price)} c/u
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {index < cart.items.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cart.itemCount} products)</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>

                {/* Coupon Section */}
                {cart.coupon ? (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Coupon: {cart.coupon.code}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">
                        Discount
                        {cart.coupon.discountType === 'percentage' &&
                          ` (${cart.coupon.discountValue}%)`}
                        {cart.coupon.discountType === 'free_shipping' && ' (Free shipping)'}
                      </span>
                      <span className="font-medium text-green-800">
                        {cart.coupon.discountType !== 'free_shipping'
                          ? `-${formatPrice(discountAmount)}`
                          : 'Applied'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Do you have a coupon?</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="uppercase"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        variant="outline"
                      >
                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <div className="text-right">
                    {isFreeShipping ? (
                      <div>
                        <Badge variant="secondary" className="text-xs mb-1">
                          Free!
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {cart.coupon?.discountType === 'free_shipping'
                            ? 'By coupon'
                            : 'For purchases over $50,000'}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span>{formatPrice(shippingCost)}</span>
                        <div className="text-xs text-gray-500">Free shipping over $50,000</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span>VAT (21%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                {/* Progress to Free Shipping */}
                {cart.total < 50000 && !cart.coupon && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-800 mb-2">
                      Add {formatPrice(50000 - cart.total)} more to get free shipping
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(cart.total / 50000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                {/* Continue Shopping */}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>

                {/* Security Badge */}
                <div className="text-center pt-4">
                  <div className="text-xs text-gray-500">🔒 100% secure purchase</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
