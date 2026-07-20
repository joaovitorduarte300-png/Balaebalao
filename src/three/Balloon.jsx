import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Um balao glossy com no e barbante.
// A forma e uma esfera levemente alongada, com um bico embaixo,
// e o barbante e um tubo fino que balanca de leve.
export function Balloon({
  position = [0, 0, 0],
  color = '#FF2E74',
  scale = 1,
  floatSpeed = 1,
  floatRange = 0.25,
  seed = 0,
  reduced = false,
}) {
  const group = useRef()
  const stringRef = useRef()

  // Geometria do barbante gerada uma vez.
  const stringGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.35, 0),
      new THREE.Vector3(0.06, -1.9, 0.03),
      new THREE.Vector3(-0.05, -2.5, -0.02),
      new THREE.Vector3(0.04, -3.15, 0.02),
    ])
    return new THREE.TubeGeometry(curve, 24, 0.012, 6, false)
  }, [])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    if (reduced) {
      group.current.position.y = position[1]
      group.current.rotation.z = 0
      return
    }
    // Flutuacao suave e independente por balao.
    group.current.position.y =
      position[1] + Math.sin(t * floatSpeed + seed) * floatRange
    group.current.rotation.z = Math.sin(t * floatSpeed * 0.6 + seed) * 0.06
    group.current.rotation.x = Math.cos(t * floatSpeed * 0.4 + seed) * 0.03
    if (stringRef.current) {
      stringRef.current.rotation.z =
        Math.sin(t * floatSpeed * 0.8 + seed) * 0.12
    }
  })

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Corpo do balao */}
      <mesh castShadow scale={[1, 1.22, 1]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.12}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.08}
          sheen={0.4}
          sheenColor={'#ffffff'}
          envMapIntensity={1.15}
        />
      </mesh>

      {/* No / bico embaixo */}
      <mesh position={[0, -1.28, 0]} scale={0.9}>
        <coneGeometry args={[0.14, 0.28, 16]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          clearcoat={0.8}
          envMapIntensity={0.9}
        />
      </mesh>

      {/* Barbante */}
      <mesh ref={stringRef} geometry={stringGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial color={'#f7e9ef'} roughness={0.9} />
      </mesh>
    </group>
  )
}
