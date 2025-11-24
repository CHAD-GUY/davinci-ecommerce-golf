import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Coupon code (e.g.: WELCOME15, FREESHIPPING)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Coupon description to display to the user',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Percentage',
          value: 'percentage',
        },
        {
          label: 'Fixed Amount',
          value: 'fixed',
        },
        {
          label: 'Free Shipping',
          value: 'free_shipping',
        },
      ],
      defaultValue: 'percentage',
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        condition: (data) => data.discountType !== 'free_shipping',
        description: 'Discount value (percentage or amount in pesos)',
      },
    },
    {
      name: 'minimumPurchase',
      type: 'number',
      min: 0,
      admin: {
        description: 'Minimum purchase amount to apply the coupon (optional)',
      },
    },
    {
      name: 'usageLimit',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum number of times the coupon can be used (leave empty for unlimited)',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times the coupon has been used',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      required: true,
      admin: {
        description: 'Date from which the coupon is valid',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      admin: {
        description: 'Date until which the coupon is valid (optional)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the coupon is active and can be used',
      },
    },
    {
      name: 'showOnSite',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Display this coupon on the public site',
      },
    },
  ],
}
