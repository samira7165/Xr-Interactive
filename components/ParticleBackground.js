'use client'
import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
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

function lerpColor(c1, c2, t) {
  return new THREE.Color(c1.r + (c2.r - c1.r) * t, c1.g + (c2.g - c1.g) * t, c1.b + (c2.b - c1.b) * t)
}

function GalaxyParticles({ count = 3000, mouse, scrollProgress }) {
  const mesh = useRef()
  const basePositions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 12 + 1
      const spiral = angle + radius * 0.3
      const armOffset = (Math.random() - 0.5) * 2
      pos[i * 3] = Math.cos(spiral) * radius + armOffset
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5
      pos[i * 3 + 2] = Math.sin(spiral) * radius + armOffset
    }
    return pos
  }, [count])

  const colorStops = useMemo(() => [
    new THREE.Color('#C084FC'),
    new THREE.Color('#60A5FA'),
    new THREE.Color('#F472B6'),
    new THREE.Color('#C084FC'),
  ], [])

  const offsets = useRef(new Float32Array(count * 3).fill(0))

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02

    const segment = scrollProgress * (colorStops.length - 1)
    const i = Math.min(Math.floor(segment), colorStops.length - 2)
    const t = segment - i
    mesh.current.material.color = lerpColor(colorStops[i], colorStops[i + 1], t)

    const positions = mesh.current.geometry.attributes.position.array
    const mx = mouse.x * 6
    const my = mouse.y * 4
    const offs = offsets.current

    for (let idx = 0; idx < count; idx++) {
      const ix = idx * 3
      const bx = basePositions[ix]
      const by = basePositions[ix + 1]
      const dx = bx - mx
      const dy = by - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      const radius = 4
      const strength = 1.5
      const influence = Math.max(0, 1 - dist / radius)
      const push = influence * influence * strength
      const targetX = dist > 0.01 ? (dx / dist) * push : 0
      const targetY = dist > 0.01 ? (dy / dist) * push : 0
      offs[ix] += (targetX - offs[ix]) * 0.04
      offs[ix + 1] += (targetY - offs[ix + 1]) * 0.04
      positions[ix] = bx + offs[ix]
      positions[ix + 1] = by + offs[ix + 1]
      positions[ix + 2] = basePositions[ix + 2]
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh} rotation={[0.5, 0, 0.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(basePositions), 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#C084FC"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function StarDust({ count = 1500, scrollProgress }) {
  const mesh = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  }, [count])

  const colorStops = useMemo(() => [
    new THREE.Color('#E0AAFF'),
    new THREE.Color('#93C5FD'),
    new THREE.Color('#FBCFE8'),
    new THREE.Color('#E0AAFF'),
  ], [])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = -state.clock.elapsedTime * 0.005
    mesh.current.rotation.x = state.clock.elapsedTime * 0.003
    const segment = scrollProgress * (colorStops.length - 1)
    const i = Math.min(Math.floor(segment), colorStops.length - 2)
    const t = segment - i
    mesh.current.material.color = lerpColor(colorStops[i], colorStops[i + 1], t)
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#E0AAFF"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function CursorLight({ mouse, scrollProgress }) {
  const light = useRef()
  const colorStops = useMemo(() => [
    new THREE.Color('#C084FC'),
    new THREE.Color('#60A5FA'),
    new THREE.Color('#F472B6'),
    new THREE.Color('#C084FC'),
  ], [])

  useFrame(() => {
    if (!light.current) return
    light.current.position.x = mouse.x * 8
    light.current.position.y = mouse.y * 5
    light.current.position.z = 3
    const segment = scrollProgress * (colorStops.length - 1)
    const i = Math.min(Math.floor(segment), colorStops.length - 2)
    const t = segment - i
    light.current.color = lerpColor(colorStops[i], colorStops[i + 1], t)
  })

  return <pointLight ref={light} intensity={3} distance={15} />
}

function Scene() {
  const mouse = useMouse()
  const scrollProgress = useScrollProgress()

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#C084FC" />
      <pointLight position={[-5, -3, 3]} intensity={1} color="#AC86B8" />
      <CursorLight mouse={mouse} scrollProgress={scrollProgress} />
      <GalaxyParticles mouse={mouse} scrollProgress={scrollProgress} />
      <StarDust scrollProgress={scrollProgress} />
    </>
  )
}

export default function ParticleBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 3, 15], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}