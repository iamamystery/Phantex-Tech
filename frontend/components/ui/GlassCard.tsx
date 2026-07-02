'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASE_PREMIUM } from '@/lib/motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

const GLASS_CLASSES = 'glass-effect transition-all duration-300 ease-out'

export default function GlassCard({
  children,
  className = '',
  animate = true,
}: GlassCardProps) {
  const reduced = useReducedMotion()

  if (!animate || reduced) {
    return (
      <div className={`${GLASS_CLASSES} ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={`${GLASS_CLASSES} ${className}`}
      whileHover={{ y: -4, transition: { duration: DURATION.fast, ease: EASE_PREMIUM } }}
    >
      {children}
    </motion.div>
  )
}
