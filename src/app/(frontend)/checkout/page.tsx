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
  email: z.string().email('Email inválido'),
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  street: z.string().min(5, 'Dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'Ciudad debe tener al menos 2 caracteres'),
  state: z.string().min(2, 'Provincia debe tener al menos 2 caracteres'),
  zipCode: z.string().min(4, 'Código postal debe tener al menos 4 caracteres'),
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
      const response = await fetch('/api/orders', {
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
        throw new Error(errorData.error || 'Error al crear el pedido')
      }

      const result = await response.json()

      // Clear cart and show success
      clearCart()
      setOrderNumber(result.order.orderNumber)
      setOrderCompleted(true)

      toast.success('¡Pedido realizado con éxito!')
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al procesar el pedido. Inténtalo nuevamente.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.items.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">
            Agrega algunos productos antes de proceder al checkout
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar Comprando
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h1>
            <p className="text-gray-600 mb-4">
              Tu pedido <strong>{orderNumber}</strong> ha sido procesado exitosamente.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Recibirás un email con los detalles de tu compra y el seguimiento del envío.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/products">Continuar Comprando</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Volver al Inicio</Link>
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
            Volver al Carrito
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Completa tu información para finalizar la compra</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input id="firstName" {...register('firstName')} placeholder="Juan" />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input id="lastName" {...register('lastName')} placeholder="Pérez" />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                    <Input id="phone" {...register('phone')} placeholder="+54 11 1234-5678" />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Dirección de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Dirección *</Label>
                    <Input id="street" {...register('street')} placeholder="Av. Corrientes 1234" />
                    {errors.street && (
                      <p className="text-red-600 text-sm mt-1">{errors.street.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input id="city" {...register('city')} placeholder="Buenos Aires" />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">Provincia *</Label>
                      <Input id="state" {...register('state')} placeholder="CABA" />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal *</Label>
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
                  <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue="mercado_pago"
                    onValueChange={(value) => setValue('paymentMethod', value as any)}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="mercado_pago">Mercado Pago</TabsTrigger>
                      <TabsTrigger value="transfer">Transferencia</TabsTrigger>
                      <TabsTrigger value="cod">Pago Contrareembolso</TabsTrigger>
                    </TabsList>

                    <TabsContent value="mercado_pago" className="mt-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Mercado Pago</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Paga de forma segura con tarjeta de crédito, débito o dinero en cuenta de
                          Mercado Pago.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="transfer" className="mt-4">
                      <div className="p-4 bg-green-50 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Transferencia Bancaria</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Realiza la transferencia a la siguiente cuenta bancaria:
                        </p>

                        <div className="bg-white p-3 rounded border border-green-200 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Banco:</span>
                            <span className="font-medium">Banco Galicia</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Titular:</span>
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
                          💡 Una vez realizada la transferencia, envía el comprobante a{' '}
                          <strong>pagos@davincistore.com</strong> con tu número de orden.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="cod" className="mt-4">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-5 h-5 text-orange-600" />
                          <span className="font-medium">Pago Contrareembolso</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Paga cuando recibas tu pedido. Disponible solo para CABA y GBA.
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
                  <span className="font-medium text-green-800">Compra 100% segura. </span>
                  <span className="text-green-700">
                    Tus datos están protegidos con encriptación SSL.
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
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
                      <span>Descuento ({cart.coupon.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>
                      {isFreeShipping ? (
                        <Badge variant="secondary" className="text-xs">
                          Gratis {cart.coupon?.discountType === 'free_shipping' && '(Cupón)'}
                        </Badge>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (21%)</span>
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
                  {isProcessing ? 'Procesando...' : `Confirmar Pedido - ${formatPrice(finalTotal)}`}
                </Button>

                {isFreeShipping && (
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      🎉 ¡Envío gratis aplicado!
                    </Badge>
                  </div>
                )}

                {cart.coupon && (
                  <div className="text-center">
                    <Badge className="text-xs bg-green-600">
                      ✓ Cupón {cart.coupon.code} aplicado
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
