import { getSiteSettings } from '@/lib/payload'
import type { Media } from '@/payload-types'

export default async function DebugOGPage() {
  const settings = await getSiteSettings()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Debug: Open Graph Settings</h1>

      <div className="space-y-6">
        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>Site Name:</strong> {settings.siteName || '❌ No configurado'}</p>
            <p><strong>Site Description:</strong> {settings.siteDescription || '❌ No configurado'}</p>
            <p><strong>Site URL:</strong> {settings.siteUrl || '❌ No configurado'}</p>
          </div>
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">SEO Meta Tags</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>Meta Title:</strong> {settings.metaTitle || '⚠️ Usando siteName por defecto'}</p>
            <p><strong>Meta Description:</strong> {settings.metaDescription || '⚠️ Usando siteDescription por defecto'}</p>
            <p><strong>Meta Keywords:</strong> {settings.metaKeywords || '❌ No configurado'}</p>
            <p><strong>Meta Author:</strong> {settings.metaAuthor || '❌ No configurado'}</p>
          </div>
        </section>

        <section className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
          <h2 className="text-xl font-semibold mb-4">🔍 Open Graph Settings</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>OG Title:</strong> {settings.ogTitle || '⚠️ Usando metaTitle o siteName por defecto'}</p>
            <p><strong>OG Description:</strong> {settings.ogDescription || '⚠️ Usando metaDescription por defecto'}</p>
            <p><strong>OG Type:</strong> {settings.ogType || 'website (default)'}</p>
            <p><strong>OG Image:</strong> {(settings.ogImage as Media | undefined)?.url || '❌ No configurado'}</p>
            {(settings.ogImage as Media | undefined)?.url && (
              <div className="mt-2">
                <p className="mb-2"><strong>Preview de OG Image:</strong></p>
                <img
                  src={(settings.ogImage as Media)?.url}
                  alt="OG Preview"
                  className="max-w-md border rounded"
                />
              </div>
            )}
          </div>
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Twitter/X Settings</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>Twitter Card:</strong> {settings.twitterCard || 'summary_large_image (default)'}</p>
            <p><strong>Twitter Handle:</strong> {settings.twitterHandle || '❌ No configurado'}</p>
          </div>
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Branding</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>Favicon:</strong> {(settings.favicon as Media | undefined)?.url || '❌ No configurado'}</p>
            <p><strong>Apple Touch Icon:</strong> {(settings.appleTouchIcon as Media | undefined)?.url || '❌ No configurado'}</p>
          </div>
        </section>

        <section className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
          <h2 className="text-xl font-semibold mb-4">✅ Metadata que se está generando</h2>
          <div className="space-y-2 font-mono text-sm whitespace-pre-wrap">
            <p><strong>Final OG Title:</strong> {settings.ogTitle || settings.metaTitle || settings.siteName}</p>
            <p><strong>Final OG Description:</strong> {settings.ogDescription || settings.metaDescription || settings.siteDescription}</p>
            <p><strong>Final OG Image URL:</strong> {(settings.ogImage as Media | undefined)?.url || '❌ NO SE MOSTRARÁ EN REDES SOCIALES'}</p>
          </div>
        </section>

        <section className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950">
          <h2 className="text-xl font-semibold mb-4">💡 Instrucciones</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Ve a <code className="bg-white dark:bg-black px-2 py-1 rounded">/admin</code></li>
            <li>Busca "Site Settings" en el menú lateral</li>
            <li>Ve a la pestaña "Open Graph (Social Media)"</li>
            <li>Completa todos los campos marcados con ❌</li>
            <li>Sube una imagen de 1200x630px para OG Image</li>
            <li>Guarda los cambios</li>
            <li>Recarga esta página para ver los cambios</li>
            <li>Verifica con <a href="https://www.opengraph.xyz/" target="_blank" rel="noopener" className="text-blue-600 underline">Open Graph Debugger</a></li>
          </ol>
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">🔧 Raw Data (para debug)</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(settings, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  )
}

