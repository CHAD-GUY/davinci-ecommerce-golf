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
                description: 'Website name',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Your trusted online store',
              admin: {
                description: 'General site description',
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              defaultValue: 'https://davinci-store.com',
              admin: {
                description: 'Full site URL (without trailing /)',
              },
            },
            {
              name: 'contactEmail',
              type: 'email',
              admin: {
                description: 'Main contact email',
              },
            },
            {
              name: 'contactPhone',
              type: 'text',
              admin: {
                description: 'Contact phone',
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
                description: 'Main site logo (recommended: PNG with transparent background)',
              },
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Logo for dark mode (optional)',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Site favicon (recommended: ICO, PNG or SVG, 32x32px or larger)',
              },
            },
            {
              name: 'appleTouchIcon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Icon for Apple devices (recommended: PNG 180x180px)',
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
                description: 'Default SEO title (if empty, uses siteName)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              maxLength: 160,
              admin: {
                description: 'Default SEO description (max. 160 characters)',
              },
            },
            {
              name: 'metaKeywords',
              type: 'text',
              admin: {
                description: 'Keywords separated by commas',
              },
            },
            {
              name: 'metaAuthor',
              type: 'text',
              admin: {
                description: 'Site author',
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
                description: 'Title for social media (if empty, uses metaTitle or siteName)',
              },
            },
            {
              name: 'ogDescription',
              type: 'textarea',
              admin: {
                description: 'Description for social media',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image for sharing on social media (recommended: 1200x630px)',
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
                description: 'Open Graph content type',
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
                description: 'Twitter/X card type',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              admin: {
                description: 'Twitter/X username (e.g.: @davincistore)',
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
                description: 'Google Search Console verification code',
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
                description: 'Organization name for Schema.org',
              },
            },
            {
              name: 'organizationLogo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Organization logo (will be used for JSON-LD)',
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
                    description: 'Full profile URL',
                  },
                },
              ],
              admin: {
                description: 'Social media profiles for Schema.org',
              },
            },
          ],
        },
      ],
    },
  ],
}
