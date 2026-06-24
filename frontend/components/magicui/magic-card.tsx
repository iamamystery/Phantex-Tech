"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

interface MagicCardBaseProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  gradientSize?: number
  gradientFrom?: string
  gradientTo?: string
}

interface MagicCardGradientProps extends MagicCardBaseProps {
  mode?: "gradient"

  gradientColor?: string
  gradientOpacity?: number

  glowFrom?: never
  glowTo?: never
  glowAngle?: never
  glowSize?: never
  glowBlur?: never
  glowOpacity?: never
}

interface MagicCardOrbProps extends MagicCardBaseProps {
  mode: "orb"

  glowFrom?: string
  glowTo?: string
  glowAngle?: number
  glowSize?: number
  glowBlur?: number
  glowOpacity?: number

  gradientColor?: never
  gradientOpacity?: never
}

type MagicCardProps = MagicCardGradientProps | MagicCardOrbProps
type ResetReason = "enter" | "leave" | "global" | "init"

function isOrbMode(props: MagicCardProps): props is MagicCardOrbProps {
  return props.mode === "orb"
}

export function MagicCard(props: MagicCardProps) {
  const {
    children,
    className,
    gradientSize = 350,
    gradientColor = "#262626",
    gradientOpacity = 0.8,
    gradientFrom = "#FCD34D", // Amber 300 (Light Champagne/Gold)
    gradientTo = "#B45309",   // Amber 700 (Deep Bronze)
    mode = "gradient",
  } = props

  const glowFrom = isOrbMode(props) ? (props.glowFrom ?? "#ee4f27") : "#ee4f27"
  const glowTo = isOrbMode(props) ? (props.glowTo ?? "#6b21ef") : "#6b21ef"
  const glowAngle = isOrbMode(props) ? (props.glowAngle ?? 90) : 90
  const glowSize = isOrbMode(props) ? (props.glowSize ?? 420) : 420
  const glowBlur = isOrbMode(props) ? (props.glowBlur ?? 60) : 60
  const glowOpacity = isOrbMode(props) ? (props.glowOpacity ?? 0.9) : 0.9
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDarkTheme = useMemo(() => {
    if (!mounted) return true
    const currentTheme = theme === "system" ? systemTheme : theme
    return currentTheme === "dark"
  }, [theme, systemTheme, mounted])

  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  // 3D Tilt values — Ultra-responsive: instant-react + super smooth
  const rotateX = useSpring(0, { stiffness: 300, damping: 30, mass: 0.8 })
  const rotateY = useSpring(0, { stiffness: 300, damping: 30, mass: 0.8 })
  
  // Gloss/Shine values — Boosted to keep up with faster tilt
  const glossX = useSpring(0, { stiffness: 300, damping: 30 })
  const glossY = useSpring(0, { stiffness: 300, damping: 30 })
  const glossOpacity = useSpring(0, { stiffness: 250, damping: 35 })

  // Performance-optimized Shadow calculation using useTransform instead of nested springs
  // This reduces the computation load on every frame
  const shadowX = useTransform(rotateY, (y) => y * -1)
  const shadowY = useTransform(rotateX, (x) => x * 1)
  
  const boxShadow = useMotionTemplate`
    ${useTransform(shadowX, (v) => v * 0.5)}px 
    ${useTransform(shadowY, (v) => v * 0.5)}px 
    30px 10px rgba(0,0,0,0.05),
    0 20px 50px rgba(0,0,0,0.08)
  `
  const boxShadowDark = useMotionTemplate`
    ${shadowX}px 
    ${shadowY}px 
    40px 15px rgba(0,0,0,0.2),
    0 20px 60px rgba(0,0,0,0.4)
  `

  const orbX = useSpring(mouseX, { stiffness: 200, damping: 40, mass: 1 })
  const orbY = useSpring(mouseY, { stiffness: 200, damping: 40, mass: 1 })
  const orbVisible = useSpring(0, { stiffness: 250, damping: 50 })

  const modeRef = useRef(mode)
  const glowOpacityRef = useRef(glowOpacity)
  const gradientSizeRef = useRef(gradientSize)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    glowOpacityRef.current = glowOpacity
  }, [glowOpacity])

  useEffect(() => {
    gradientSizeRef.current = gradientSize
  }, [gradientSize])

  const reset = useCallback(
    (reason: ResetReason = "leave") => {
      const currentMode = modeRef.current

      if (currentMode === "orb") {
        if (reason === "enter") orbVisible.set(glowOpacityRef.current)
        else {
          orbVisible.set(0)
          rotateX.set(0)
          rotateY.set(0)
          glossOpacity.set(0)
        }
        return
      }

      const off = -gradientSizeRef.current
      mouseX.set(off)
      mouseY.set(off)
      rotateX.set(0)
      rotateY.set(0)
      glossOpacity.set(0)
    },
    [mouseX, mouseY, orbVisible, rotateX, rotateY, glossOpacity]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Update spotlight/gloss position directly (no extra math)
      mouseX.set(x)
      mouseY.set(y)
      glossX.set(x)
      glossY.set(y)
      glossOpacity.set(0.15)

      // Compute tilt — normalized to [-1, 1] then scaled to ±30°
      const hw = rect.width * 0.5
      const hh = rect.height * 0.5
      rotateY.set(((x - hw) / hw) * 30)
      rotateX.set(((hh - y) / hh) * 30)
    },
    [mouseX, mouseY, rotateX, rotateY, glossX, glossY, glossOpacity]
  )

  useEffect(() => {
    reset("init")
  }, [reset])

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset("global")
    }
    const handleBlur = () => reset("global")
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") reset("global")
    }

    window.addEventListener("pointerout", handleGlobalPointerOut)
    window.addEventListener("blur", handleBlur)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", handleBlur)
      document.addEventListener("visibilitychange", handleVisibility)
    }
  }, [reset])

  return (
    <div 
      style={{ perspective: "1500px", ...props.style }} 
      className="group/magic-card h-full w-full"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => reset("leave")}
      onPointerEnter={() => reset("enter")}
    >
      <motion.div
        className={cn(
          "group relative isolate h-full w-full overflow-hidden rounded-[2.5rem] p-px transform-gpu",
          className
        )}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: isDarkTheme ? boxShadowDark : boxShadow,
          willChange: "transform, box-shadow",
        }}
      >
        {/* Isolated Border Layer (Paint Optimization) - Enhanced visibility */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] transform-gpu opacity-40 dark:opacity-60"
          style={{
            background: useMotionTemplate`
              radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
                ${gradientFrom},
                ${gradientTo},
                rgba(0,0,0,0.1) 100%
              )
            `,
            willChange: "background",
          }}
        />

        {/* Padding Box Mask (Equivalent to nested structure) */}
        <div className="absolute inset-px z-1 rounded-[inherit] bg-transparent pointer-events-none" />

        {/* Inner Glass Layer - Optimized for Color Harmony & Contrast */}
        <div className="absolute inset-px z-20 rounded-[inherit] bg-white/5 dark:bg-[var(--text-primary)]/40 backdrop-blur-[32px] border border-[var(--border)] dark:border-white/10 pointer-events-none" />
        
        {/* Rim Light / Edge Highlight - Integrating Site Accent */}
        <div className="absolute inset-px z-25 rounded-[inherit] pointer-events-none opacity-60 ring-1 ring-inset ring-[var(--accent)]/20 dark:ring-white/10" />


        {/* Dynamic Gloss/Shimmer Layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 opacity-0 mix-blend-soft-light transform-gpu"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                circle at ${glossX}px ${glossY}px,
                rgba(255, 255, 255, 0.4) 0%,
                transparent 70%
              )
            `,
            opacity: glossOpacity,
            willChange: "transform, opacity",
          }}
        />

        {/* Main Spotlight Effect */}
        {mode === "gradient" && (
          <>
            {/* Deep Glow Layer */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/magic-card:opacity-40 transform-gpu"
              style={{
                background: useMotionTemplate`
                  radial-gradient(${gradientSize * 1.5}px circle at ${mouseX}px ${mouseY}px,
                    ${gradientFrom}33,
                    transparent 100%
                  )
                `,
                willChange: "background",
              }}
            />
            
            {/* Interaction Spotlight */}
            <motion.div
              suppressHydrationWarning
              className="pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/magic-card:opacity-100 transform-gpu"
              style={{
                background: useMotionTemplate`
                  radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
                    ${isDarkTheme ? gradientColor : "#FEF3C755"},
                    transparent 100%
                  )
                `,
                opacity: gradientOpacity,
                willChange: "background, opacity",
              }}
            />
          </>
        )}

        {mode === "orb" && (
          <motion.div
            suppressHydrationWarning
            aria-hidden="true"
            className="pointer-events-none absolute z-30 transform-gpu"
            style={{
              width: glowSize,
              height: glowSize,
              x: orbX,
              y: orbY,
              translateX: "-50%",
              translateY: "-50%",
              borderRadius: 9999,
              filter: `blur(${glowBlur}px)`,
              opacity: orbVisible,
              background: `linear-gradient(${glowAngle}deg, ${glowFrom}, ${glowTo})`,
              mixBlendMode: isDarkTheme ? "screen" : "multiply",
              willChange: "transform, opacity",
            }}
          />
        )}
        
        {/* Content wrapper with lifted Z-axis */}
        <div 
          className="relative z-50 h-full w-full"
          style={{ 
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
