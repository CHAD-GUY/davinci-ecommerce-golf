import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Davinci Store</h3>
            <p className="text-gray-400 mb-4">
              Tu tienda online de confianza para ropa y accesorios de la mejor calidad.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Atención al Cliente</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">
                  Guía de Tallas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">info@davincistore.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">+54 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Davinci Store. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}