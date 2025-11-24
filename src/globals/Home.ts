import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              required: true,
              defaultValue: 'Bienvenido a Davinci Store',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              defaultValue: 'Descubre nuestra colección exclusiva',
            },
            {
              name: 'heroMediaType',
              type: 'select',
              required: true,
              defaultValue: 'image',
              options: [
                {
                  label: 'Imagen',
                  value: 'image',
                },
                {
                  label: 'Video',
                  value: 'video',
                },
              ],
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data.heroMediaType === 'image',
                description: 'Imagen de fondo para el hero (recomendado: 1920x1080px)',
              },
            },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data.heroMediaType === 'video',
                description: 'Video de fondo para el hero (formato: MP4, WebM)',
              },
            },
            {
              name: 'heroVideoFallback',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data.heroMediaType === 'video',
                description: 'Imagen de respaldo para dispositivos que no soporten video',
              },
            },
            {
              name: 'heroCTA',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'Ver Productos',
                },
                {
                  name: 'link',
                  type: 'text',
                  defaultValue: '/products',
                },
              ],
            },
          ],
        },
        {
          label: 'Video Sections',
          fields: [
            {
              name: 'videoSections',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description: 'Video principal (MP4, WebM)',
                  },
                },
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Imagen de vista previa del video',
                  },
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  admin: {
                    description: 'URL de video externo (YouTube, Vimeo) - opcional, si se usa esto se ignora el video subido',
                  },
                },
                {
                  name: 'layout',
                  type: 'select',
                  defaultValue: 'full',
                  options: [
                    {
                      label: 'Ancho completo',
                      value: 'full',
                    },
                    {
                      label: 'Video izquierda, texto derecha',
                      value: 'video-left',
                    },
                    {
                      label: 'Texto izquierda, video derecha',
                      value: 'video-right',
                    },
                  ],
                },
                {
                  name: 'cta',
                  type: 'group',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                    },
                    {
                      name: 'link',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Featured Products',
          fields: [
            {
              name: 'featuredProductsTitle',
              type: 'text',
              defaultValue: 'Productos Destacados',
            },
            {
              name: 'featuredProductsSubtitle',
              type: 'textarea',
            },
            {
              name: 'showFeaturedProducts',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Mostrar sección de productos destacados (se mostrarán automáticamente los productos marcados como destacados)',
              },
            },
            {
              name: 'featuredProductsLimit',
              type: 'number',
              defaultValue: 6,
              min: 1,
              max: 12,
              admin: {
                description: 'Cantidad de productos destacados a mostrar',
              },
            },
          ],
        },
        {
          label: 'Call to Action Sections',
          fields: [
            {
              name: 'ctaSections',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  admin: {
                    description: 'Color de fondo en formato HEX (ej: #000000) - se usa si no hay imagen',
                  },
                },
                {
                  name: 'textColor',
                  type: 'select',
                  defaultValue: 'dark',
                  options: [
                    {
                      label: 'Oscuro',
                      value: 'dark',
                    },
                    {
                      label: 'Claro',
                      value: 'light',
                    },
                  ],
                },
                {
                  name: 'buttons',
                  type: 'array',
                  maxRows: 2,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'link',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'variant',
                      type: 'select',
                      defaultValue: 'default',
                      options: [
                        {
                          label: 'Principal',
                          value: 'default',
                        },
                        {
                          label: 'Secundario',
                          value: 'secondary',
                        },
                        {
                          label: 'Outline',
                          value: 'outline',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
