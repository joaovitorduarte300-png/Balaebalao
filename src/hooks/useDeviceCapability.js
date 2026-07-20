import { useMemo } from 'react'

// Heuristica simples para decidir se o device aguenta a cena 3D completa.
// Devices fracos ganham um fallback leve (sem confete, menos baloes, sem DOF).
export function useDeviceCapability() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return { tier: 'high', lowPower: false }
    }

    const cores = navigator.hardwareConcurrency || 4
    const memory = navigator.deviceMemory || 4
    const coarse =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches
    const narrow = window.innerWidth < 720

    // Sinal de WebGL disponivel.
    let webgl = true
    try {
      const canvas = document.createElement('canvas')
      webgl = !!(
        canvas.getContext('webgl2') || canvas.getContext('webgl')
      )
    } catch (e) {
      webgl = false
    }

    const weak = cores <= 4 || memory <= 3 || (coarse && narrow)
    const tier = !webgl ? 'none' : weak ? 'low' : 'high'

    return {
      tier,
      lowPower: tier !== 'high',
      hasWebGL: webgl,
    }
  }, [])
}
