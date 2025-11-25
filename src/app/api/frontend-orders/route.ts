import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      customer,
      shippingAddress,
      items,
      subtotal,
      coupon,
      shipping,
      tax,
      total,
      paymentMethod,
    } = body

    // Validate required fields
    if (!customer || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()

    // Update stock for each item BEFORE creating the order
    for (const item of items) {
      try {
        // Get the product
        const product = await payload.findByID({
          collection: 'products',
          id: item.productId,
        })

        if (!product) {
          console.error(`Product not found: ${item.productId}`)
          continue
        }

        // If product has variants
        if (product.productType === 'variable' && item.variant) {
          const variantId = item.variant.id

          // Find the variant in the product
          const variantIndex = product.variants?.findIndex((v: any) => v.id === variantId)

          if (variantIndex !== undefined && variantIndex !== -1 && product.variants) {
            const variant = product.variants[variantIndex]
            const newStock = Math.max(0, (variant.stock || 0) - item.quantity)

            // Update the variant stock
            const updatedVariants = [...product.variants]
            updatedVariants[variantIndex] = {
              ...variant,
              stock: newStock,
            }

            await payload.update({
              collection: 'products',
              id: item.productId,
              data: {
                variants: updatedVariants,
              },
            })

            console.log(`Updated variant stock for product ${item.productId}, variant ${variantId}: ${variant.stock} -> ${newStock}`)
          }
        } else if (product.productType === 'simple') {
          // Simple product - update simpleStock
          const newStock = Math.max(0, (product.simpleStock || 0) - item.quantity)

          await payload.update({
            collection: 'products',
            id: item.productId,
            data: {
              simpleStock: newStock,
            },
          })

          console.log(`Updated simple product stock for ${item.productId}: ${product.simpleStock} -> ${newStock}`)
        }
      } catch (stockError) {
        console.error(`Error updating stock for product ${item.productId}:`, stockError)
        // Continue with order creation even if stock update fails
      }
    }

    // Transform cart items to order items format
    const orderItems = items.map((item: any) => {
      const orderItem: any = {
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }

      // Add variant info if exists
      if (item.variant) {
        orderItem.variant = `${item.variant.color || ''}-${item.variant.size || ''}`.trim()
      }

      return orderItem
    })

    // Create the order
    const order = await payload.create({
      collection: 'orders',
      data: {
        customer: {
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone || '',
        },
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: 'Argentina',
        },
        billingAddress: {
          sameAsShipping: true,
        },
        items: orderItems,
        subtotal,
        coupon: coupon ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: coupon.discountAmount,
        } : undefined,
        shipping,
        tax,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
