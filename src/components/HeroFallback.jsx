import { balloonColors } from '../content'

// Fallback puramente CSS para devices sem WebGL.
// Baloes desenhados com gradiente e brilho, sem custo de 3D.
const FALLBACK = [
  { c: balloonColors.rosa, x: '12%', y: '18%', s: 1.15, d: 0 },
  { c: balloonColors.amarelo, x: '30%', y: '8%', s: 0.95, d: 0.6 },
  { c: balloonColors.azul, x: '50%', y: '16%', s: 1.25, d: 1.1 },
  { c: balloonColors.coral, x: '70%', y: '9%', s: 0.9, d: 0.3 },
  { c: balloonColors.menta, x: '86%', y: '20%', s: 1.05, d: 0.9 },
]

export function HeroFallback() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      {FALLBACK.map((b, i) => (
        <span
          key={i}
          className="fb-balloon"
          style={{
            left: b.x,
            top: b.y,
            transform: `scale(${b.s})`,
            animationDelay: `${b.d}s`,
            '--balloon': b.c,
          }}
        />
      ))}
    </div>
  )
}
