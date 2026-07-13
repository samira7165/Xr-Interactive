'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setProgress(Math.min(Math.max(p, 0), 1))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return progress
}

function useMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])
  return mouse
}

function TunnelParticles({ count = 2000, scrollProgress, mouse }) {
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
    const purple = new THREE.Color('#C084FC')
    const blue = new THREE.Color('#60A5FA')
    const pink = new THREE.Color('#F472B6')
    const white = new THREE.Color('#E0AAFF')
    const palette = [purple, blue, pink, white]
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

      const spiralAngle = time * 0.1 * tunnelStrength
      const cos = Math.cos(spiralAngle)
      const sin = Math.sin(spiralAngle)

      let x = bx * perspective
      let y = by * perspective

      const rotX = x * cos - y * sin
      const rotY = x * sin + y * cos

      const squeeze = 1 - tunnelStrength * 0.4
      x = rotX * squeeze
      y = rotY * squeeze

      const cursorPush = Math.max(0, 1 - Math.sqrt(
        Math.pow(x - mouse.x * 3, 2) +
        Math.pow(y - mouse.y * 2, 2)
      ) / 3) * 0.5

      if (cursorPush > 0) {
        const dx = x - mouse.x * 3
        const dy = y - mouse.y * 2
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
        x += (dx / dist) * cursorPush
        y += (dy / dist) * cursorPush
      }

      positions[ix] = x
      positions[ix + 1] = y
      positions[ix + 2] = bz
    }
    mesh.current.geometry.attributes.position.needsUpdate = true

   const baseSize = 0.03
    const stretchSize = baseSize + tunnelStrength * 0.02
    mesh.current.material.size = stretchSize

    const baseOpacity = 0.7
    const tunnelOpacity = baseOpacity + tunnelStrength * 0.3
    mesh.current.material.opacity = tunnelOpacity
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(basePositions), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function EdgeStreaks({ count = 300, scrollProgress }) {
  const mesh = useRef()

  const basePositions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 4 + 6
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = Math.random() * 40 - 20
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const positions = mesh.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime
    const strength = scrollProgress * scrollProgress

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      let z = basePositions[ix + 2] + time * (0.5 + strength * 3)
      if (z > 20) z -= 40
      if (z < -20) z += 40

      positions[ix] = basePositions[ix] * (1 - strength * 0.2)
      positions[ix + 1] = basePositions[ix + 1] * (1 - strength * 0.2)
      positions[ix + 2] = z
    }
    mesh.current.geometry.attributes.position.needsUpdate = true

    mesh.current.material.opacity = strength * 0.6
    mesh.current.material.size = 0.02 + strength * 0.03
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(basePositions), 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#E0AAFF"
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function StarField({ count = 800 }) {
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
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function CursorLight({ mouse }) {
  const light = useRef()
  useFrame(() => {
    if (light.current) {
      light.current.position.x = mouse.x * 5
      light.current.position.y = mouse.y * 3
      light.current.position.z = 5
    }
  })
  return <pointLight ref={light} intensity={2} color="#C084FC" distance={12} />
}

function Scene() {
  const mouse = useMouse()
  const scrollProgress = useScrollProgress()

  return (
    <>
      <ambientLight intensity={0.2} />
      <CursorLight mouse={mouse} />
      <TunnelParticles scrollProgress={scrollProgress} mouse={mouse} />
      <EdgeStreaks scrollProgress={scrollProgress} />
      <StarField />
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
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