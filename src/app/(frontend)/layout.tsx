import React from 'react'
import './styles.css'
import { CartProvider } from '@/contexts/CartContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/ecommerce/Header'
import { Footer } from '@/components/ecommerce/Footer'
import { ReactLenis } from 'lenis/react'

export const metadata = {
  description: 'Ecommerce Davinci - Tu tienda online de ropa y accesorios',
  title: 'Ecommerce Davinci',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body>
        <ReactLenis root />
        <QueryProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
