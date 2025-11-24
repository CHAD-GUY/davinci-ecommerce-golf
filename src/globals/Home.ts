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
              defaultValue: 'Welcome to Davinci Store',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              defaultValue: 'Discover our exclusive collection',
            },
            {
              name: 'heroMediaType',
              type: 'select',
              required: true,
              defaultValue: 'image',
              options: [
                {
                  label: 'Image',
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
                description: 'Background image for hero (recommended: 1920x1080px)',
              },
            },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data.heroMediaType === 'video',
                description: 'Background video for hero (format: MP4, WebM)',
              },
            },
            {
              name: 'heroVideoFallback',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data.heroMediaType === 'video',
                description: 'Fallback image for devices that do not support video',
              },
            },
            {
              name: 'heroCTA',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'View Products',
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
                    description: 'Main video (MP4, WebM)',
                  },
                },
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Video preview image',
                  },
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  admin: {
                    description: 'External video URL (YouTube, Vimeo) - optional, if used the uploaded video is ignored',
                  },
                },
                {
                  name: 'layout',
                  type: 'select',
                  defaultValue: 'full',
                  options: [
                    {
                      label: 'Full width',
                      value: 'full',
                    },
                    {
                      label: 'Video left, text right',
                      value: 'video-left',
                    },
                    {
                      label: 'Text left, video right',
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
              defaultValue: 'Featured Products',
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
                description: 'Show featured products section (products marked as featured will be displayed automatically)',
              },
            },
            {
              name: 'featuredProductsLimit',
              type: 'number',
              defaultValue: 6,
              min: 1,
              max: 12,
              admin: {
                description: 'Number of featured products to display',
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
                    description: 'Background color in HEX format (e.g.: #000000) - used if there is no image',
                  },
                },
                {
                  name: 'textColor',
                  type: 'select',
                  defaultValue: 'dark',
                  options: [
                    {
                      label: 'Dark',
                      value: 'dark',
                    },
                    {
                      label: 'Light',
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
                          label: 'Primary',
                          value: 'default',
                        },
                        {
                          label: 'Secondary',
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
