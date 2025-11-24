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
        description: 'Código del cupón (ej: BIENVENIDO15, ENVIOGRATIS)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Descripción del cupón para mostrar al usuario',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Porcentaje',
          value: 'percentage',
        },
        {
          label: 'Monto fijo',
          value: 'fixed',
        },
        {
          label: 'Envío gratis',
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
        description: 'Valor del descuento (porcentaje o monto en pesos)',
      },
    },
    {
      name: 'minimumPurchase',
      type: 'number',
      min: 0,
      admin: {
        description: 'Monto mínimo de compra para aplicar el cupón (opcional)',
      },
    },
    {
      name: 'usageLimit',
      type: 'number',
      min: 0,
      admin: {
        description: 'Cantidad máxima de usos del cupón (dejar vacío para ilimitado)',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Cantidad de veces que se usó el cupón',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      required: true,
      admin: {
        description: 'Fecha desde la cual el cupón es válido',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      admin: {
        description: 'Fecha hasta la cual el cupón es válido (opcional)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Si el cupón está activo y puede ser usado',
      },
    },
    {
      name: 'showOnSite',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mostrar este cupón en el sitio público',
      },
    },
  ],
}
