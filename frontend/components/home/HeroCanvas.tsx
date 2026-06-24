'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ── WebGL detection ──
function checkWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch { return false }
}

function CSSFallback() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/[0.06] blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-orange-400/[0.04] blur-[80px]" />
    </div>
  )
}

// ── Scroll-linked scene controller ──
function ScrollController({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { camera } = useThree()

  useFrame(() => {
    const t = scrollRef.current / (typeof window !== 'undefined' ? window.innerHeight : 800)
    // Subtle camera tilt as user scrolls
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -t * 1.2, 0.05)
    camera.lookAt(0, -t * 0.6, 0)
  })

  return null
}

// ── Main glass sphere ──
function GlassSphere({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    // Gentle auto-rotation
    meshRef.current.rotation.x = t * 0.08
    meshRef.current.rotation.y = t * 0.12

    // Scroll-based scale breathing
    const scroll = scrollRef.current / (typeof window !== 'undefined' ? window.innerHeight : 800)
    const targetScale = 1 - scroll * 0.15
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, Math.max(targetScale, 0.6), 0.04))
  })

  useEffect(() => {
    const mesh = meshRef.current
    return () => {
      if (!mesh) return
      mesh.geometry.dispose()
      if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose())
      else (mesh.material as THREE.Material).dispose()
    }
  }, [])

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, -0.5, 0]}>
        <icosahedronGeometry args={[2.2, 8]} />
        <MeshDistortMaterial
          color="#F5A623"
          roughness={0.15}
          metalness={0.4}
          distort={0.2}
          speed={1.5}
          transparent
          opacity={0.25}
        />
      </mesh>
    </Float>
  )
}

// ── Orbiting torus ring ──
function OrbitRing({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = Math.PI / 3 + t * 0.1
    meshRef.current.rotation.z = t * 0.06

    // Scroll parallax — ring moves up slower than camera
    const scroll = scrollRef.current / (typeof window !== 'undefined' ? window.innerHeight : 800)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.1 - scroll * 0.5, 0.04)
  })

  useEffect(() => {
    const mesh = meshRef.current
    return () => {
      if (!mesh) return
      mesh.geometry.dispose()
      if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose())
      else (mesh.material as THREE.Material).dispose()
    }
  }, [])

  return (
    <mesh ref={meshRef} position={[0, 0.1, 0]}>
      <torusGeometry args={[3.2, 0.04, 16, 100]} />
      <meshStandardMaterial
        color="#F59E0B"
        emissive="#F59E0B"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// ── Subtle floating particles ──
function FloatingParticles() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.015
    ref.current.rotation.x = state.clock.elapsedTime * 0.008
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#F5A623"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  )
}

// ── Full scene ──
function Scene() {
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FFF7ED" />
      <pointLight position={[-3, 2, 4]} intensity={0.4} color="#F59E0B" />

      {/* Scroll controller */}
      <ScrollController scrollRef={scrollRef} />

      {/* 3D objects */}
      <GlassSphere scrollRef={scrollRef} />
      <OrbitRing scrollRef={scrollRef} />
      <FloatingParticles />
    </>
  )
}

// ── Export ──
export default function HeroCanvas() {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    setWebglSupported(checkWebGL())
  }, [])

  if (!webglSupported) return <CSSFallback />

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 42 }}
      className="absolute inset-0 pointer-events-none"
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  )
}
