'use client'

import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

const GLASS_CLASSES = 'glass-effect transition-all duration-300'

export default function GlassCard({
  children,
  className = '',
  animate = true,
}: GlassCardProps) {
  if (!animate) {
    return (
      <div className={`${GLASS_CLASSES} ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={`${GLASS_CLASSES} ${className}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  )
}
