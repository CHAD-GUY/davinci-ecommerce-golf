#!/usr/bin/env node

/**
 * Script para verificar que los Open Graph tags están presentes en la página
 * Uso: node check-og-tags.js [url]
 */

const http = require('http')

const url = process.argv[2] || 'http://localhost:3001'

console.log(`\n🔍 Verificando Open Graph tags en: ${url}\n`)

const req = http.get(url, (res) => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    // Extraer los meta tags de Open Graph
    const ogTitleMatch = data.match(/<meta property="og:title" content="([^"]*)"/)
    const ogDescMatch = data.match(/<meta property="og:description" content="([^"]*)"/)
    const ogImageMatch = data.match(/<meta property="og:image" content="([^"]*)"/)
    const ogTypeMatch = data.match(/<meta property="og:type" content="([^"]*)"/)
    const ogUrlMatch = data.match(/<meta property="og:url" content="([^"]*)"/)
    const twitterCardMatch = data.match(/<meta name="twitter:card" content="([^"]*)"/)
    const twitterImageMatch = data.match(/<meta name="twitter:image" content="([^"]*)"/)

    console.log('📊 Resultados:\n')

    if (ogTitleMatch) {
      console.log('✅ og:title:', ogTitleMatch[1])
    } else {
      console.log('❌ og:title: NO ENCONTRADO')
    }

    if (ogDescMatch) {
      console.log('✅ og:description:', ogDescMatch[1])
    } else {
      console.log('❌ og:description: NO ENCONTRADO')
    }

    if (ogImageMatch) {
      console.log('✅ og:image:', ogImageMatch[1])
    } else {
      console.log('❌ og:image: NO ENCONTRADO')
    }

    if (ogTypeMatch) {
      console.log('✅ og:type:', ogTypeMatch[1])
    } else {
      console.log('❌ og:type: NO ENCONTRADO')
    }

    if (ogUrlMatch) {
      console.log('✅ og:url:', ogUrlMatch[1])
    } else {
      console.log('❌ og:url: NO ENCONTRADO')
    }

    console.log('\n🐦 Twitter/X:')

    if (twitterCardMatch) {
      console.log('✅ twitter:card:', twitterCardMatch[1])
    } else {
      console.log('❌ twitter:card: NO ENCONTRADO')
    }

    if (twitterImageMatch) {
      console.log('✅ twitter:image:', twitterImageMatch[1])
    } else {
      console.log('❌ twitter:image: NO ENCONTRADO')
    }

    // Contar cuántos tags encontramos
    const found = [
      ogTitleMatch, ogDescMatch, ogImageMatch, ogTypeMatch,
      ogUrlMatch, twitterCardMatch, twitterImageMatch
    ].filter(Boolean).length

    const total = 7

    console.log(`\n📈 Total: ${found}/${total} tags encontrados`)

    if (found === total) {
      console.log('\n🎉 ¡Todos los Open Graph tags están presentes!\n')
    } else if (found > 0) {
      console.log('\n⚠️  Algunos tags faltan. Verifica tu configuración.\n')
    } else {
      console.log('\n❌ No se encontraron Open Graph tags. El servidor podría estar cacheando.\n')
      console.log('   Intenta:')
      console.log('   1. Detener el servidor (Ctrl+C)')
      console.log('   2. Ejecutar: rm -rf .next')
      console.log('   3. Reiniciar: pnpm dev')
      console.log('   4. Esperar a que compile completamente')
      console.log('   5. Ejecutar este script nuevamente\n')
    }
  })
})

req.on('error', (err) => {
  console.error('❌ Error conectando al servidor:', err.message)
  console.log('\n💡 Asegúrate de que el servidor esté corriendo:')
  console.log('   pnpm dev\n')
  process.exit(1)
})

