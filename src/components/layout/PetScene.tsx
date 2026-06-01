import { useRef, useLayoutEffect, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type * as THREE_T from 'three'

const heartGeo = new THREE.ExtrudeGeometry(
  (() => {
    const s = 0.55
    const shape = new THREE.Shape()
    shape.moveTo(0, s * 0.6)
    shape.bezierCurveTo(0, s, -s, s, -s, s * 0.3)
    shape.bezierCurveTo(-s, -s * 0.3, 0, -s * 0.6, 0, -s)
    shape.bezierCurveTo(0, -s * 0.6, s, -s * 0.3, s, s * 0.3)
    shape.bezierCurveTo(s, s, 0, s, 0, s * 0.6)
    return shape
  })(),
  { depth: 0.1, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 2 },
)

function Bone() {
  return (
    <group rotation={[0, 0, Math.PI / 5]}>
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshToonMaterial color="#fff7ed" />
      </mesh>
      <mesh position={[0, -0.75, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshToonMaterial color="#fff7ed" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 1.5, 12]} />
        <meshToonMaterial color="#fff7ed" />
      </mesh>
    </group>
  )
}

function Collar() {
  return (
    <group>
      <mesh>
        <torusGeometry args={[0.42, 0.08, 8, 16]} />
        <meshToonMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.14, 8]} />
        <meshToonMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, -0.62, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.25, 0.06]} />
        <meshToonMaterial color="#fbbf24" />
      </mesh>
    </group>
  )
}

function Heart() {
  return (
    <mesh geometry={heartGeo}>
      <meshToonMaterial color="#f9a8d4" />
    </mesh>
  )
}

function OrbitItem({
  angle,
  radius,
  children,
}: {
  angle: number
  radius: number
  children: ReactNode
}) {
  const ref = useRef<THREE_T.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.3
  })

  return (
    <group position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
      <Billboard lockX lockZ>
        <Float speed={0.6} rotationIntensity={0} floatIntensity={0.08}>
          <group ref={ref} scale={1.15}>{children}</group>
        </Float>
      </Billboard>
    </group>
  )
}

function OrbitCamera() {
  const camera = useThree((state) => state.camera)

  useLayoutEffect(() => {
    camera.position.set(0, 3.8, 3.4)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function Waltz() {
  const groupRef = useRef<THREE_T.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.25
    groupRef.current.position.x = Math.sin(t * 0.3) * 0.1
    groupRef.current.position.z = Math.cos(t * 0.35) * 0.1
  })

  const r = 1.1
  const a1 = 0
  const a2 = (Math.PI * 2) / 3
  const a3 = (Math.PI * 4) / 3

  return (
    <group ref={groupRef}>
      <OrbitItem angle={a1} radius={r}>
        <Bone />
      </OrbitItem>
      <OrbitItem angle={a2} radius={r}>
        <Heart />
      </OrbitItem>
      <OrbitItem angle={a3} radius={r}>
        <Collar />
      </OrbitItem>
    </group>
  )
}

function Scene() {
  return (
    <group>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[2, 6, 4]} intensity={0.9} color="#ffffff" />
      <group scale={0.75}>
        <Waltz />
      </group>
    </group>
  )
}

export function PetScene() {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <OrbitCamera />
      <Scene />
    </Canvas>
  )
}
