import { Suspense, lazy, useEffect, useRef } from 'react'
import {
  brand,
  hero,
  diagnostico,
  estrategia,
  conteudo,
  trafego,
  vitrine,
  investimento,
  fechamento,
} from './content'
import { Reveal } from './components/Reveal'
import { HeroFallback } from './components/HeroFallback'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useDeviceCapability } from './hooks/useDeviceCapability'
import './styles/app.css'

// A cena 3D so entra via lazy para nao pesar o primeiro paint.
const BalloonScene = lazy(() =>
  import('./three/BalloonScene').then((m) => ({ default: m.BalloonScene })),
)

function Brand({ withSignature = false }) {
  return (
    <span className="brand">
      {brand.logo ? (
        <img src={brand.logo} alt={brand.name} className="brand-logo" />
      ) : (
        <span className="brand-mark">{brand.name}</span>
      )}
    </span>
  )
}

function SectionHeader({ eyebrow, title, id }) {
  return (
    <header className="sec-head">
      <Reveal as="p" className="eyebrow">
        {eyebrow}
      </Reveal>
      <Reveal as="h2" className="sec-title" delay={80} id={id}>
        {title}
      </Reveal>
    </header>
  )
}

export default function App() {
  const reduced = useReducedMotion()
  const device = useDeviceCapability()
  const scrollRef = useRef(0)
  const heroRef = useRef(null)

  // Progresso do scroll dentro do hero, para o parallax 3D.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = heroRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)))
        scrollRef.current = p
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const show3D = device.tier !== 'none'

  return (
    <div className="page">
      <a className="skip-link" href="#conteudo-proposta">
        Ir para o conteúdo
      </a>

      <header className="topbar">
        <Brand />
        <span className="topbar-seal">{hero.seal}</span>
      </header>

      <main id="conteudo-proposta">
        {/* HERO */}
        <section className="hero" ref={heroRef}>
          <div className="hero-3d" aria-hidden="true">
            {show3D ? (
              <Suspense fallback={<HeroFallback />}>
                <BalloonScene
                  scrollRef={scrollRef}
                  reduced={reduced}
                  lowPower={device.lowPower}
                />
              </Suspense>
            ) : (
              <HeroFallback />
            )}
          </div>

          <div className="hero-inner">
            <div className="hero-copy load-seq">
              <p className="hero-seal">{hero.seal}</p>
              <h1 className="hero-title">
                {hero.titleBefore}
                <span className="hl">{hero.titleHighlight}</span>
                {hero.titleAfter}
              </h1>
              <p className="hero-sub">{hero.subtitle}</p>
              <ul className="hero-tags">
                {hero.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* DIAGNOSTICO */}
        <section className="sec sec-light" id="diagnostico">
          <div className="wrap">
            <SectionHeader eyebrow={diagnostico.eyebrow} title={diagnostico.title} />
            <div className="two-col">
              <div className="prose">
                {diagnostico.paragraphs.map((p, i) => (
                  <Reveal as="p" key={i} delay={i * 90}>
                    {p}
                  </Reveal>
                ))}
              </div>
              <Reveal className="chips" delay={120}>
                {diagnostico.chips.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ESTRATEGIA */}
        <section className="sec sec-dark" id="estrategia">
          <div className="wrap">
            <SectionHeader eyebrow={estrategia.eyebrow} title={estrategia.title} />
            <Reveal as="p" className="lead">
              {estrategia.lead}
            </Reveal>
            <div className="pillars">
              {estrategia.pilares.map((p, i) => (
                <Reveal className="pillar" key={p.key} delay={i * 100}>
                  <span className="pillar-key">{p.key}</span>
                  <p>{p.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CONTEUDO */}
        <section className="sec sec-light" id="conteudo">
          <div className="wrap">
            <SectionHeader eyebrow={conteudo.eyebrow} title={conteudo.title} />
            <Reveal as="p" className="lead lead-dark">
              {conteudo.lead}
            </Reveal>
            <div className="content-grid">
              {conteudo.items.map((it, i) => (
                <Reveal className="content-card" key={it.name} delay={i * 100}>
                  <span className={`kind kind-${it.kind === 'Vídeo' ? 'video' : 'static'}`}>
                    {it.kind}
                  </span>
                  <h3>{it.name}</h3>
                  <p>{it.text}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="ritmo">
              <strong>{conteudo.ritmo}</strong>
            </Reveal>
            <Reveal as="p" className="nota" delay={80}>
              {conteudo.nota}
            </Reveal>
          </div>
        </section>

        {/* TRAFEGO */}
        <section className="sec sec-dark" id="trafego">
          <div className="wrap">
            <SectionHeader eyebrow={trafego.eyebrow} title={trafego.title} />
            <Reveal as="p" className="lead">
              {trafego.lead}
            </Reveal>
            <div className="points">
              {trafego.pontos.map((p, i) => (
                <Reveal className="point" key={p.n} delay={i * 80}>
                  <span className="point-n">{p.n}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal as="p" className="nota nota-light" delay={80}>
              {trafego.nota}
            </Reveal>
          </div>
        </section>

        {/* VITRINE */}
        <section className="sec sec-light" id="vitrine">
          <div className="wrap wrap-narrow">
            <SectionHeader eyebrow={vitrine.eyebrow} title={vitrine.title} />
            <div className="prose prose-lg">
              {vitrine.paragraphs.map((p, i) => (
                <Reveal as="p" key={i} delay={i * 100}>
                  {p}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* INVESTIMENTO */}
        <section className="sec sec-invest" id="investimento">
          <div className="wrap">
            <SectionHeader eyebrow={investimento.eyebrow} title={investimento.title} />
            <div className="invest-grid">
              <Reveal className="price-card">
                <span className="price-seal">{investimento.seal}</span>
                <p className="price-label">{investimento.label}</p>
                <p className="price">
                  <span className="price-from">{investimento.priceFrom}</span>
                  <span className="price-to">
                    {investimento.priceTo}
                    <span className="price-unit">{investimento.priceUnit}</span>
                  </span>
                </p>
                <p className="price-note">{investimento.priceNote}</p>
              </Reveal>
              <Reveal className="invest-list" delay={120}>
                <p className="invest-list-title">O que está incluso</p>
                <ul>
                  {investimento.incluso.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <p className="termos">{investimento.termos}</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FECHAMENTO */}
        <section className="sec sec-close" id="fechamento">
          <div className="wrap wrap-narrow">
            <SectionHeader eyebrow={fechamento.eyebrow} title={fechamento.title} />
            <Reveal as="p" className="lead">
              {fechamento.text}
            </Reveal>
            <Reveal className="signature" delay={120}>
              <span className="sig-name">{fechamento.signature}</span>
              <span className="sig-placeholder">{fechamento.signaturePlaceholder}</span>
            </Reveal>
            <Reveal as="p" className="validade" delay={160}>
              {fechamento.validade}
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="foot">
        <Brand />
        <span>{hero.tags[0]}</span>
      </footer>
    </div>
  )
}
