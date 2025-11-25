import React from 'react'
import './styles.css'
import { CartProvider } from '@/contexts/CartContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { ReactLenis } from 'lenis/react'
import { getSiteSettings } from '@/lib/payload'
import type { Metadata } from 'next'
import type { Media } from '@/payload-types'

// Revalidate every 60 seconds to pick up changes from Payload CMS
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings()
    console.log(settings)

    const siteName = settings.siteName || 'Ecommerce Davinci'
    const siteDescription = settings.siteDescription || 'Tu tienda online de ropa y accesorios'
    const siteUrl = settings.siteUrl || 'https://davinci-store.com'
    const metaTitle = settings.metaTitle || siteName
    const metaDescription = settings.metaDescription || siteDescription
    const ogTitle = settings.ogTitle || metaTitle
    const ogDescription = settings.ogDescription || metaDescription

    // Get media URLs
    const faviconMedia = settings.favicon as Media | undefined
    const ogImageMedia = settings.ogImage as Media | undefined
    const appleTouchIconMedia = settings.appleTouchIcon as Media | undefined

    const metadata: Metadata = {
      title: {
        default: metaTitle,
        template: `%s | ${siteName}`,
      },
      description: metaDescription,
      keywords: settings.metaKeywords?.split(',').map((k: string) => k.trim()) || [],
      authors: settings.metaAuthor ? [{ name: settings.metaAuthor }] : undefined,
      creator: settings.metaAuthor,
      publisher: settings.organizationName || siteName,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: '/',
      },
      openGraph: {
        type: (settings.ogType as any) || 'website',
        locale: 'es_AR',
        url: siteUrl,
        siteName,
        title: ogTitle,
        description: ogDescription,
        images: ogImageMedia
          ? [
              {
                url: ogImageMedia.url || '',
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ]
          : undefined,
      },
      twitter: {
        card: (settings.twitterCard as any) || 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        site: settings.twitterHandle,
        creator: settings.twitterHandle,
        images: ogImageMedia ? [ogImageMedia.url || ''] : undefined,
      },
      icons: {
        icon: faviconMedia?.url || '/favicon.ico',
        shortcut: faviconMedia?.url || '/favicon.ico',
        apple: appleTouchIconMedia?.url || faviconMedia?.url || '/apple-touch-icon.png',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      verification: settings.googleSiteVerification
        ? {
            google: settings.googleSiteVerification,
          }
        : undefined,
    }

    return metadata
  } catch (error) {
    console.error('Error generating metadata:', error)
    // Fallback metadata
    return {
      title: 'Ecommerce Davinci',
      description: 'Tu tienda online de ropa y accesorios',
    }
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Get settings for JSON-LD
  let settings: any = null
  try {
    settings = await getSiteSettings()
  } catch (error) {
    console.error('Error loading site settings:', error)
  }

  // Build JSON-LD structured data
  const organizationSchema = settings
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.organizationName || settings.siteName,
        url: settings.siteUrl,
        logo: settings.organizationLogo ? (settings.organizationLogo as Media).url : undefined,
        contactPoint: {
          '@type': 'ContactPoint',
          email: settings.contactEmail,
          telephone: settings.contactPhone,
          contactType: 'customer service',
        },
        sameAs: settings.socialProfiles?.map((profile: any) => profile.url) || [],
      }
    : null

  return (
    <html lang="es">
      <head>
        {/* JSON-LD Structured Data */}
        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
        )}

        {/* Google Analytics */}
        {settings?.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}

        {/* Google Tag Manager */}
        {settings?.googleTagManagerId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${settings.googleTagManagerId}');
              `,
            }}
          />
        )}

        {/* Facebook Pixel */}
        {settings?.facebookPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${settings.facebookPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body className="bg-background text-foreground">
        {/* Google Tag Manager (noscript) */}
        {settings?.googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <ReactLenis root />
        <QueryProvider>
          <CartProvider>
            <Header logo={settings?.logo as Media | undefined} siteName={settings?.siteName} />
            {children}
            <Footer />
            <Toaster />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
