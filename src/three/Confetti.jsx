import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Textura macia (circulo com borda suave) para simular bokeh de fora de foco.
function makeSoftTexture(blur) {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  // blur alto deixa a peca mais difusa nas bordas (fora de foco).
  const edge = blur ? 0.15 : 0.62
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(edge, 'rgba(255,255,255,0.95)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// Confete 3D com profundidade de campo simulada: pecas ao fundo ficam
// maiores, mais transparentes e com borda difusa, lendo como desfoque.
export function Confetti({ count = 60, colors, reduced = false }) {
  const near = useRef()
  const far = useRef()

  const sharpTex = useMemo(() => makeSoftTexture(false), [])
  const softTex = useMemo(() => makeSoftTexture(true), [])

  const palette = useMemo(
    () => Object.values(colors).map((c) => new THREE.Color(c)),
    [colors],
  )

  // Divide o confete em dois planos: perto (nitido) e longe (desfocado).
  const layers = useMemo(() => {
    const build = (n, zMin, zMax, spread) => {
      const positions = new Float32Array(n * 3)
      const colorArr = new Float32Array(n * 3)
      const phases = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.9
        positions[i * 3 + 2] = zMin + Math.random() * (zMax - zMin)
        const c = palette[Math.floor(Math.random() * palette.length)]
        colorArr[i * 3] = c.r
        colorArr[i * 3 + 1] = c.g
        colorArr[i * 3 + 2] = c.b
        phases[i] = Math.random() * Math.PI * 2
      }
      return { positions, colorArr, phases }
    }
    const nearCount = Math.round(count * 0.55)
    return {
      near: build(nearCount, 1.5, 4.5, 11),
      far: build(count - nearCount, -6, -2, 16),
    }
  }, [count, palette])

  useFrame((state) => {
    if (reduced) return
    const t = state.clock.elapsedTime
    for (const [ref, data, drift] of [
      [near, layers.near, 0.5],
      [far, layers.far, 0.22],
    ]) {
      const pts = ref.current
      if (!pts) continue
      const arr = pts.geometry.attributes.position.array
      for (let i = 0; i < data.phases.length; i++) {
        const base = data.positions[i * 3 + 1]
        arr[i * 3 + 1] =
          base + Math.sin(t * drift + data.phases[i]) * 0.35
        arr[i * 3] =
          data.positions[i * 3] +
          Math.cos(t * drift * 0.7 + data.phases[i]) * 0.25
      }
      pts.geometry.attributes.position.needsUpdate = true
      pts.rotation.z = Math.sin(t * 0.05) * 0.1
    }
  })

  const Layer = ({ innerRef, data, size, tex, opacity }) => (
    <points ref={innerRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={data.phases.length}
          array={data.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={data.phases.length}
          array={data.colorArr}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={tex}
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.NormalBlending}
      />
    </points>
  )

  return (
    <group>
      <Layer
        innerRef={far}
        data={layers.far}
        size={0.9}
        tex={softTex}
        opacity={0.45}
      />
      <Layer
        innerRef={near}
        data={layers.near}
        size={0.28}
        tex={sharpTex}
        opacity={0.95}
      />
    </group>
  )
}
