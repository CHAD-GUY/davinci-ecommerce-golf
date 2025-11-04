'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

interface NavLink {
  title: string
  href: string
}

const links: NavLink[] = [
  { title: 'Inicio', href: '/' },
  { title: 'Productos', href: '/products' },
  { title: 'Categorías', href: '/categories' },
  { title: 'Nosotros', href: '/about' },
  { title: 'Contacto', href: '/contact' },
]

// Animación simple: fade + slide desde abajo con stagger
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.08, // Stagger rápido y sutil
      ease: [0.32, 0.72, 0, 1] as [number, number, number, number], // Exponential ease-out
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
}

const footerVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.5, // Aparece después de los items principales
      ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
}

export function Nav() {
  return (
    <div className="flex flex-col justify-between px-6 py-4">
      {/* Links principales */}
      <nav className="flex flex-col gap-1">
        {links.map((link, i) => (
          <motion.div
            key={`nav-link-${i}`}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Link
              href={link.href}
              className="block text-white text-2xl font-medium py-2 px-3 rounded-lg hover:bg-white/5 transition-colors no-underline"
            >
              {link.title}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Links secundarios */}
      <motion.div
        variants={footerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex gap-4 mt-6 pt-4 border-t border-white/10"
      >
        <Link
          href="/cart"
          className="text-white/60 text-sm hover:text-white transition-colors no-underline"
        >
          Carrito
        </Link>
        <Link
          href="/account"
          className="text-white/60 text-sm hover:text-white transition-colors no-underline"
        >
          Mi Cuenta
        </Link>
      </motion.div>
    </div>
  )
}
