# Proposta Bala e Balão

Proposta comercial de página única para o Bala e Balão, salão de festas e buffet
infantil em Uberlândia, MG. Marca pessoal (João), sem nome de agência.

Feita em React + Vite, com Three.js (via @react-three/fiber e @react-three/drei)
para os balões 3D do hero e o confete com profundidade simulada.

## Rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # servir o build de produção
```

## Onde mexer

- **Texto:** todo o conteúdo fica em `src/content.js`. É o arquivo para editar
  copy, preço e listas.
- **Marca:** em `src/content.js`, no objeto `brand`. Troque `logo: null` por um
  caminho de imagem (ex: `/logo.svg` em `public/`) para usar um logo no lugar do
  nome.
- **Cores:** variáveis em `src/styles/global.css` (`:root`). As cores de balão
  também estão em `content.js` para a cena 3D.
- **Cena 3D:** `src/three/`. O arranjo dos balões está em
  `BalloonScene.jsx` (constante `CLUSTER`).

## Exportar em PDF

Abra a página no navegador e use Imprimir, salvando como PDF. Há um layout de
impressão dedicado (`@media print` em `src/styles/app.css`) que troca os fundos
escuros por claro, esconde a cena 3D e mantém a hierarquia.

## Acessibilidade e performance

- `prefers-reduced-motion` é respeitado (sem parallax, sem flutuação, sem
  reveal animado).
- Foco de teclado visível e link de pular para o conteúdo.
- Devices sem WebGL recebem um fallback de balões em CSS. Devices fracos rodam
  uma versão leve da cena (menos balões, sem confete, menor resolução).
