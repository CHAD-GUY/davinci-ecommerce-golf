import React from 'react'
import './styles.css'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/ecommerce/Header'

export const metadata = {
  description: 'Ecommerce Davinci - Tu tienda online de ropa y accesorios',
  title: 'Ecommerce Davinci',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
