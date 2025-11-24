import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'zipCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          defaultValue: 'Argentina',
        },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'street',
          type: 'text',
          admin: {
            condition: (data) => !data.billingAddress?.sameAsShipping,
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            condition: (data) => !data.billingAddress?.sameAsShipping,
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            condition: (data) => !data.billingAddress?.sameAsShipping,
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          admin: {
            condition: (data) => !data.billingAddress?.sameAsShipping,
          },
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'Argentina',
          admin: {
            condition: (data) => !data.billingAddress?.sameAsShipping,
          },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'variant',
          type: 'text',
          admin: {
            description: 'Variant identifier (e.g., "red-large")',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Price at time of purchase',
          },
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            readOnly: true,
            description: 'quantity × price',
          },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'coupon',
      type: 'group',
      fields: [
        {
          name: 'code',
          type: 'text',
          admin: {
            description: 'Código del cupón aplicado',
          },
        },
        {
          name: 'discountType',
          type: 'select',
          options: [
            { label: 'Porcentaje', value: 'percentage' },
            { label: 'Monto fijo', value: 'fixed' },
            { label: 'Envío gratis', value: 'free_shipping' },
          ],
        },
        {
          name: 'discountValue',
          type: 'number',
          min: 0,
          admin: {
            description: 'Valor del descuento aplicado',
          },
        },
        {
          name: 'discountAmount',
          type: 'number',
          min: 0,
          admin: {
            description: 'Monto total descontado',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'shipping',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'tax',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        {
          label: 'Mercado Pago',
          value: 'mercado_pago',
        },
        {
          label: 'Transfer',
          value: 'transfer',
        },
        {
          label: 'Cash on Delivery',
          value: 'cod',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about the order',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Generate order number if not exists
        if (!data.orderNumber) {
          data.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
        }
        
        // Calculate totals
        if (data.items) {
          data.subtotal = data.items.reduce((sum: number, item: any) => {
            item.total = item.quantity * item.price
            return sum + item.total
          }, 0)

          // Calculate coupon discount
          let discountAmount = 0
          if (data.coupon?.code && data.coupon?.discountType) {
            if (data.coupon.discountType === 'percentage') {
              discountAmount = Math.round((data.subtotal * (data.coupon.discountValue || 0)) / 100)
            } else if (data.coupon.discountType === 'fixed') {
              discountAmount = data.coupon.discountValue || 0
            } else if (data.coupon.discountType === 'free_shipping') {
              // Free shipping is handled in shipping calculation
              discountAmount = 0
            }
            data.coupon.discountAmount = discountAmount
          }

          // Apply free shipping if coupon applies
          let shippingCost = data.shipping || 0
          if (data.coupon?.discountType === 'free_shipping') {
            shippingCost = 0
            data.shipping = 0
          }

          data.total = data.subtotal - discountAmount + shippingCost + (data.tax || 0)
        }

        return data
      },
    ],
  },
}