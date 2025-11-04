'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { Nav } from './Nav'

export function Header() {
  const [isActive, setIsActive] = useState(false)
  const { cart } = useCart()

  return (
    <>
      <header className="fixed top-0 z-50 w-full p-2 flex items-center justify-center">
        {/* Contenedor principal: crece con easing suave y controlado */}
        <motion.div
          layout
          transition={{
            layout: {
              type: "spring",
              stiffness: 300,
              damping: 30,
            },
          }}
          className="bg-foreground py-2 pl-4 rounded-2xl w-2xl flex flex-col shadow-md overflow-hidden"
        >
          {/* Header fijo: logo + botón */}
          <div className="flex items-center justify-between w-full">
            <Link href="/">
              <Image src="/icon.png" alt="Logo" width={100} height={100} className="h-10 w-auto" />
            </Link>

            {/* Botón: scale suave sin bounce */}
            <motion.button
              onClick={() => setIsActive(!isActive)}
              animate={{
                scale: isActive ? 0.95 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
              }}
              className="w-20 h-10 rounded-full cursor-pointer flex items-center justify-center border-0 p-0"
            >
              <div
                className={`w-full relative before:content-[''] before:block before:h-[2px] before:rounded before:w-[40%] before:mx-auto before:bg-[#8B5B29] before:absolute before:left-1/2 before:-translate-x-1/2 before:transition-all before:duration-300 after:content-[''] after:block after:h-[2px] after:rounded after:w-[40%] after:mx-auto after:bg-[#8B5B29] after:absolute after:left-1/2 after:-translate-x-1/2 after:transition-all after:duration-300 ${
                  isActive
                    ? 'before:rotate-45 before:top-0 after:-rotate-45 after:top-0'
                    : 'before:-top-1 after:top-1'
                }`}
              ></div>
            </motion.button>
          </div>

          {/* Navegación expandible: altura con easing elegante */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                  transition: {
                    height: {
                      type: "spring",
                      stiffness: 250,
                      damping: 25,
                    },
                    opacity: {
                      duration: 0.25,
                      delay: 0.1,
                      ease: 'easeOut',
                    },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: {
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    },
                    opacity: {
                      duration: 0.15,
                      ease: 'easeIn',
                    },
                  },
                }}
                className="overflow-hidden"
              >
                <Nav />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        {isActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
              }}
              className="fixed left-0 w-full top-0 h-screen bg-foreground/50 z-10 backdrop-blur-sm"
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
