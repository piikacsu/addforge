import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 100
const CONNECTION_DISTANCE = 150
const MOUSE_RADIUS = 120

function Particles() {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const linesRef = useRef<THREE.LineSegments>(null)

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400
      velocities[i * 3] = (Math.random() - 0.5) * 0.3
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
    }
    return { positions, velocities }
  }, [])

  const linePositions = useMemo(() => {
    return new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6)
  }, [])

  const lineColors = useMemo(() => {
    return new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6)
  }, [])

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    return geo
  }, [linePositions, lineColors])

  useFrame(({ pointer }) => {
    if (!meshRef.current) return

    mouseRef.current.x += (pointer.x * 600 - mouseRef.current.x) * 0.05
    mouseRef.current.y += (pointer.y * 400 - mouseRef.current.y) * 0.05

    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array
    const time = performance.now() * 0.001

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      posArr[i3] += velocities[i3] + Math.sin(time + i) * 0.1
      posArr[i3 + 1] += velocities[i3 + 1] + Math.cos(time + i * 0.7) * 0.1
      posArr[i3 + 2] += velocities[i3 + 2]

      if (Math.abs(posArr[i3]) > 600) velocities[i3] *= -1
      if (Math.abs(posArr[i3 + 1]) > 400) velocities[i3 + 1] *= -1
      if (Math.abs(posArr[i3 + 2]) > 200) velocities[i3 + 2] *= -1

      const dx = posArr[i3] - mouseRef.current.x
      const dy = posArr[i3 + 1] - mouseRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
        posArr[i3] += (dx / dist) * force * 2
        posArr[i3 + 1] += (dy / dist) * force * 2
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true

    if (linesRef.current) {
      let lineIdx = 0
      const linePosArr = linesRef.current.geometry.attributes.position.array as Float32Array
      const lineColArr = linesRef.current.geometry.attributes.color.array as Float32Array

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = posArr[i * 3] - posArr[j * 3]
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1]
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE

            linePosArr[lineIdx * 6] = posArr[i * 3]
            linePosArr[lineIdx * 6 + 1] = posArr[i * 3 + 1]
            linePosArr[lineIdx * 6 + 2] = posArr[i * 3 + 2]
            linePosArr[lineIdx * 6 + 3] = posArr[j * 3]
            linePosArr[lineIdx * 6 + 4] = posArr[j * 3 + 1]
            linePosArr[lineIdx * 6 + 5] = posArr[j * 3 + 2]

            const cx = (mouseRef.current.x - (posArr[i * 3] + posArr[j * 3]) / 2) / 600
            const cyanBoost = Math.max(0, 1 - Math.abs(cx)) * alpha * 0.5

            lineColArr[lineIdx * 6] = 0.6 * alpha + cyanBoost
            lineColArr[lineIdx * 6 + 1] = 0.85 * alpha + cyanBoost
            lineColArr[lineIdx * 6 + 2] = 1.0 * alpha + cyanBoost
            lineColArr[lineIdx * 6 + 3] = 0.6 * alpha + cyanBoost
            lineColArr[lineIdx * 6 + 4] = 0.85 * alpha + cyanBoost
            lineColArr[lineIdx * 6 + 5] = 1.0 * alpha + cyanBoost

            lineIdx++
          }
        }
      }

      linesRef.current.geometry.setDrawRange(0, lineIdx * 2)
      linesRef.current.geometry.attributes.position.needsUpdate = true
      linesRef.current.geometry.attributes.color.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2.5}
          color="#ffffff"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.3} />
      </lineSegments>
    </>
  )
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 500], near: 1, far: 1000 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
