import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true, // Everyone can read site settings
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'Davinci Store',
              admin: {
                description: 'Nombre del sitio web',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Tu tienda online de confianza',
              admin: {
                description: 'Descripción general del sitio',
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              defaultValue: 'https://davinci-store.com',
              admin: {
                description: 'URL completa del sitio (sin / al final)',
              },
            },
            {
              name: 'contactEmail',
              type: 'email',
              admin: {
                description: 'Email de contacto principal',
              },
            },
            {
              name: 'contactPhone',
              type: 'text',
              admin: {
                description: 'Teléfono de contacto',
              },
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Logo principal del sitio (recomendado: PNG con fondo transparente)',
              },
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Logo para modo oscuro (opcional)',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Favicon del sitio (recomendado: ICO, PNG o SVG, 32x32px o mayor)',
              },
            },
            {
              name: 'appleTouchIcon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Icono para dispositivos Apple (recomendado: PNG 180x180px)',
              },
            },
          ],
        },
        {
          label: 'SEO Meta Tags',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: {
                description: 'Título SEO por defecto (si está vacío, usa siteName)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              maxLength: 160,
              admin: {
                description: 'Descripción SEO por defecto (máx. 160 caracteres)',
              },
            },
            {
              name: 'metaKeywords',
              type: 'text',
              admin: {
                description: 'Palabras clave separadas por comas',
              },
            },
            {
              name: 'metaAuthor',
              type: 'text',
              admin: {
                description: 'Autor del sitio',
              },
            },
          ],
        },
        {
          label: 'Open Graph (Social Media)',
          fields: [
            {
              name: 'ogTitle',
              type: 'text',
              admin: {
                description: 'Título para redes sociales (si está vacío, usa metaTitle o siteName)',
              },
            },
            {
              name: 'ogDescription',
              type: 'textarea',
              admin: {
                description: 'Descripción para redes sociales',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Imagen para compartir en redes sociales (recomendado: 1200x630px)',
              },
            },
            {
              name: 'ogType',
              type: 'select',
              defaultValue: 'website',
              options: [
                { label: 'Website', value: 'website' },
                { label: 'Article', value: 'article' },
                { label: 'Product', value: 'product' },
              ],
              admin: {
                description: 'Tipo de contenido Open Graph',
              },
            },
            {
              name: 'twitterCard',
              type: 'select',
              defaultValue: 'summary_large_image',
              options: [
                { label: 'Summary', value: 'summary' },
                { label: 'Summary Large Image', value: 'summary_large_image' },
                { label: 'App', value: 'app' },
                { label: 'Player', value: 'player' },
              ],
              admin: {
                description: 'Tipo de tarjeta de Twitter/X',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              admin: {
                description: 'Usuario de Twitter/X (ej: @davincistore)',
              },
            },
          ],
        },
        {
          label: 'Analytics & Tracking',
          fields: [
            {
              name: 'googleAnalyticsId',
              type: 'text',
              admin: {
                description: 'Google Analytics Measurement ID (ej: G-XXXXXXXXXX)',
              },
            },
            {
              name: 'googleTagManagerId',
              type: 'text',
              admin: {
                description: 'Google Tag Manager ID (ej: GTM-XXXXXXX)',
              },
            },
            {
              name: 'facebookPixelId',
              type: 'text',
              admin: {
                description: 'Facebook Pixel ID',
              },
            },
            {
              name: 'googleSiteVerification',
              type: 'text',
              admin: {
                description: 'Código de verificación de Google Search Console',
              },
            },
          ],
        },
        {
          label: 'Schema.org (JSON-LD)',
          fields: [
            {
              name: 'organizationName',
              type: 'text',
              admin: {
                description: 'Nombre de la organización para Schema.org',
              },
            },
            {
              name: 'organizationLogo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Logo de la organización (se usará para JSON-LD)',
              },
            },
            {
              name: 'socialProfiles',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'URL completa del perfil',
                  },
                },
              ],
              admin: {
                description: 'Perfiles de redes sociales para Schema.org',
              },
            },
          ],
        },
      ],
    },
  ],
}
