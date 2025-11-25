'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/contexts/CartContext'
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const checkoutSchema = z.object({
  email: z.string().email('Invalid email'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  street: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(4, 'Zip code must be at least 4 characters'),
  paymentMethod: z.enum(['mercado_pago', 'transfer', 'cod']),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

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

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)

    try {
      // Create order via API
      const response = await fetch('/api/frontend-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
          shippingAddress: {
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
          items: cart.items,
          subtotal: cart.total,
          coupon: cart.coupon,
          shipping: shippingCost,
          tax,
          total: finalTotal,
          paymentMethod: data.paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error creating the order')
      }

      const result = await response.json()

      // Clear cart and show success
      clearCart()
      setOrderNumber(result.order.orderNumber)
      setOrderCompleted(true)

      toast.success('Order placed successfully!')
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error processing the order. Please try again.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.items.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products before proceeding to checkout</p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (orderCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Your order <strong>{orderNumber}</strong> has been successfully processed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will receive an email with your purchase details and shipping tracking.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your information to finalize the purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="you@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...register('firstName')} placeholder="John" />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...register('lastName')} placeholder="Doe" />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" {...register('phone')} placeholder="+54 11 1234-5678" />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Address *</Label>
                    <Input id="street" {...register('street')} placeholder="123 Main Street" />
                    {errors.street && (
                      <p className="text-red-600 text-sm mt-1">{errors.street.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" {...register('city')} placeholder="Buenos Aires" />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" {...register('state')} placeholder="CABA" />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input id="zipCode" {...register('zipCode')} placeholder="1234" />
                      {errors.zipCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue="mercado_pago"
                    onValueChange={(value) => setValue('paymentMethod', value as any)}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="mercado_pago">Mercado Pago</TabsTrigger>
                      <TabsTrigger value="transfer">Bank Transfer</TabsTrigger>
                      <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                    </TabsList>

                    <TabsContent value="mercado_pago" className="mt-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Mercado Pago</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Pay securely with credit card, debit card or Mercado Pago account balance.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="transfer" className="mt-4">
                      <div className="p-4 bg-green-50 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Bank Transfer</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Make the transfer to the following bank account:
                        </p>

                        <div className="bg-white p-3 rounded border border-green-200 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bank:</span>
                            <span className="font-medium">Banco Galicia</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account Holder:</span>
                            <span className="font-medium">Davinci Store S.A.</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">CUIT:</span>
                            <span className="font-mono">30-12345678-9</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">CBU:</span>
                            <span className="font-mono">0070999530000012345678</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Alias:</span>
                            <span className="font-medium">DAVINCI.STORE</span>
                          </div>
                        </div>

                        <p className="text-xs text-green-700 mt-2">
                          💡 Once the transfer is completed, send the receipt to{' '}
                          <strong>pagos@davincistore.com</strong> with your order number.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="cod" className="mt-4">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-5 h-5 text-orange-600" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Pay when you receive your order. Available only for CABA and GBA.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <div className="text-sm">
                  <span className="font-medium text-green-800">100% secure purchase. </span>
                  <span className="text-green-700">
                    Your data is protected with SSL encryption.
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                        {item.variant && (
                          <p className="text-xs text-gray-500">
                            {item.variant.color && `${item.variant.color}`}
                            {item.variant.color && item.variant.size && ' • '}
                            {item.variant.size && `${item.variant.size.toUpperCase()}`}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                          <span className="font-medium text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>

                  {/* Show coupon discount if applied */}
                  {cart.coupon && discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({cart.coupon.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {isFreeShipping ? (
                        <Badge variant="secondary" className="text-xs">
                          Free {cart.coupon?.discountType === 'free_shipping' && '(Coupon)'}
                        </Badge>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (21%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : `Confirm Order - ${formatPrice(finalTotal)}`}
                </Button>

                {isFreeShipping && (
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      🎉 Free shipping applied!
                    </Badge>
                  </div>
                )}

                {cart.coupon && (
                  <div className="text-center">
                    <Badge className="text-xs bg-green-600">
                      ✓ Coupon {cart.coupon.code} applied
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
