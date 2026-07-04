import type { MetadataRoute } from 'next';

/** Web App Manifest generated at /manifest.webmanifest for PWA installability. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calsuma — Premium Retro Calculator',
    short_name: 'Calsuma',
    description:
      'A premium, tactile 3D retro calculator with scientific mode, history and memory. Works offline.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#d7d0c0',
    theme_color: '#e7e1d4',
    categories: ['utilities', 'productivity'],
    icons: [
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
