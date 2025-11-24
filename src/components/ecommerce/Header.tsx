'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          Davinci Store
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium hover:underline underline-offset-4">
            Productos
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent">
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/products"
                  className="text-lg font-medium hover:underline underline-offset-4"
                  onClick={() => setIsOpen(false)}
                >
                  Productos
                </Link>
                <Link
                  href="/cart"
                  className="text-lg font-medium hover:underline underline-offset-4 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  Carrito {itemCount > 0 && `(${itemCount})`}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
