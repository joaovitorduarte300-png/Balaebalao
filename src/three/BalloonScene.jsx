import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { Balloon } from './Balloon'
import { Confetti } from './Confetti'
import { balloonColors } from '../content'

// Cacho de baloes posicionado a mao para um arranjo agradavel.
// Deslocado para a direita para deixar a coluna de texto respirar.
const CLUSTER = [
  { pos: [0.6, 1.0, -0.5], color: balloonColors.rosa, scale: 1.1, speed: 0.9 },
  { pos: [1.9, 1.7, 0.4], color: balloonColors.amarelo, scale: 0.92, speed: 1.15 },
  { pos: [2.9, 0.9, -0.2], color: balloonColors.azul, scale: 1.22, speed: 0.8 },
  { pos: [4.1, 1.6, 0.5], color: balloonColors.coral, scale: 0.88, speed: 1.05 },
  { pos: [4.6, 0.2, -0.4], color: balloonColors.menta, scale: 1.05, speed: 0.95 },
  { pos: [3.3, -0.5, 0.7], color: balloonColors.rosa, scale: 0.78, speed: 1.25 },
  { pos: [1.6, -0.2, 0.6], color: balloonColors.coral, scale: 0.74, speed: 1.2 },
]

// Move o grupo de baloes seguindo o mouse e o scroll (parallax leve).
function Rig({ children, scrollRef, reduced }) {
  const group = useRef()
  const target = useThree((s) => s.pointer)

  useFrame(() => {
    if (!group.current) return
    if (reduced) {
      group.current.position.x = 0
      group.current.position.y = 0
      group.current.rotation.y = 0
      return
    }
    const scroll = scrollRef.current || 0
    // Mouse: deslocamento sutil. Scroll: sobe e some de leve.
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      target.x * 0.6,
      0.05,
    )
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      target.y * 0.35 + scroll * 2.2,
      0.05,
    )
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      target.x * 0.12,
      0.05,
    )
  })

  return <group ref={group}>{children}</group>
}

export function BalloonScene({ scrollRef, reduced = false, lowPower = false }) {
  const balloons = lowPower ? CLUSTER.slice(0, 5) : CLUSTER
  const confettiCount = lowPower ? 26 : 64
  const dpr = lowPower ? [1, 1.3] : [1, 1.9]

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.4, 8.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
    >
      <Suspense fallback={null}>
        {/* Luz de estudio para brilho glossy */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.3} />
        <pointLight position={[-5, -2, 3]} intensity={0.6} color={'#ff7ab6'} />
        <pointLight position={[5, 3, -2]} intensity={0.5} color={'#7fd8ff'} />

        {/* Ambiente construido com lightformers, sem baixar HDR da rede.
            Gera os reflexos especulares nos baloes. */}
        <Environment resolution={256} frames={1}>
          <color attach="background" args={['#1b0826']} />
          <Lightformer
            intensity={2.4}
            position={[0, 3, 4]}
            scale={[8, 3, 1]}
            color={'#ffffff'}
          />
          <Lightformer
            intensity={1.4}
            position={[-4, 1, 2]}
            scale={[3, 4, 1]}
            color={'#ff8ec2'}
          />
          <Lightformer
            intensity={1.2}
            position={[4, 2, 1]}
            scale={[3, 4, 1]}
            color={'#8fd6ff'}
          />
          <Lightformer
            intensity={1}
            position={[0, -3, 2]}
            scale={[6, 2, 1]}
            color={'#ffd47a'}
          />
        </Environment>

        {!lowPower && (
          <Confetti count={confettiCount} colors={balloonColors} reduced={reduced} />
        )}

        <Rig scrollRef={scrollRef} reduced={reduced}>
          {balloons.map((b, i) => (
            <Balloon
              key={i}
              position={b.pos}
              color={b.color}
              scale={b.scale}
              floatSpeed={b.speed}
              floatRange={0.22 + (i % 3) * 0.05}
              seed={i * 1.7}
              reduced={reduced}
            />
          ))}
        </Rig>
      </Suspense>
    </Canvas>
  )
}
