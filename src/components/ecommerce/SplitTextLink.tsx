'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface SplitTextLinkProps {
  href: string
  text: string
  className?: string
}

export function SplitTextLink({ href, text, className = '' }: SplitTextLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      className={`relative overflow-hidden flex flex-col ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative"
        animate={{
          y: isHovered ? '-100%' : '0%',
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1], // Custom easing curve - more smooth and elastic
        }}
      >
        <span className="text-foreground block">{text}</span>
        <span className="text-foreground absolute top-[100%] left-0 block">{text}</span>
      </motion.div>
    </Link>
  )
}
