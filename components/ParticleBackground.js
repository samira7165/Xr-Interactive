'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? window.scrollY / scrollable : 0
      setProgress(Math.min(Math.max(p, 0), 1))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return progress
}

function TunnelParticles({ count = 2500, scrollProgress }) {
  const mesh = useRef()

  const { basePositions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 8 + 1
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = Math.random() * 40 - 20
      spd[i] = Math.random() * 0.5 + 0.3
    }
    return { basePositions: pos, speeds: spd }
  }, [count])

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#C084FC'),
      new THREE.Color('#60A5FA'),
      new THREE.Color('#F472B6'),
      new THREE.Color('#E0AAFF'),
    ]
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return col
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const positions = mesh.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime
    const tunnelStrength = scrollProgress * scrollProgress
    const pullSpeed = tunnelStrength * 0.8

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const bx = basePositions[ix]
      const by = basePositions[ix + 1]
      let bz = basePositions[ix + 2]

      bz += time * speeds[i] * (0.3 + pullSpeed * 2)
      if (bz > 20) bz -= 40
      if (bz < -20) bz += 40

      const zNorm = (bz + 20) / 40
      const perspective = 1 - zNorm * tunnelStrength * 0.6
      const squeeze = 1 - tunnelStrength * 0.4

      positions[ix] = bx * perspective * squeeze
      positions[ix + 1] = by * perspective * squeeze
      positions[ix + 2] = bz
    }
    mesh.current.geometry.attributes.position.needsUpdate = true

    mesh.current.material.size = 0.015 + tunnelStrength * 0.008
    mesh.current.material.opacity = 0.8 + tunnelStrength * 0.2
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(basePositions), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function StarDust({ count = 1200 }) {
  const mesh = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.003
      mesh.current.rotation.x = state.clock.elapsedTime * 0.002
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.008}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function Scene() {
  const scrollProgress = useScrollProgress()
  return (
    <>
      <ambientLight intensity={0.2} />
      <TunnelParticles scrollProgress={scrollProgress} />
      <StarDust />
    </>
  )
}

export default function ParticleBackground() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, isMobile ? 12 : 8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: !isMobile }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
      >
        <Scene />
      </Canvas>
    </div>
  )
}