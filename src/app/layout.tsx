import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeManager } from '@/context/ThemeManager';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calsuma.app';
const DESCRIPTION =
  'Calsuma is a premium, tactile 3D retro calculator for the web — scientific mode, unlimited history, memory, keyboard support and a beautifully engineered industrial design.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Calsuma — Premium 3D Retro Calculator',
    template: '%s · Calsuma',
  },
  description: DESCRIPTION,
  applicationName: 'Calsuma',
  keywords: [
    'calculator',
    'scientific calculator',
    'retro calculator',
    'online calculator',
    'Calsuma',
    'web app',
    'PWA',
  ],
  authors: [{ name: 'Uv' }],
  creator: 'Uv',
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Calsuma',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Calsuma — Premium 3D Retro Calculator',
    description: DESCRIPTION,
    siteName: 'Calsuma',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'The Calsuma calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calsuma — Premium 3D Retro Calculator',
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e7e1d4' },
    { media: '(prefers-color-scheme: dark)', color: '#161719' },
  ],
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calsuma',
  description: DESCRIPTION,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Scientific and classic modes',
    'Unlimited searchable history',
    'Memory functions',
    'Full keyboard support',
    'Offline PWA support',
  ],
};

/**
 * A tiny blocking script that applies the persisted theme before first paint,
 * preventing a flash of the wrong theme. Kept minimal and dependency-free.
 */
const themeBootScript = `(function(){try{var raw=localStorage.getItem('calsuma:settings:v1');var s=raw?JSON.parse(raw).state:null;var d=document.documentElement;d.setAttribute('data-theme',(s&&s.theme)||'ivory');d.setAttribute('data-contrast',s&&s.highContrast?'high':'normal');d.setAttribute('data-font-size',(s&&s.fontSize)||'medium');d.setAttribute('data-animations',s&&s.animationsEnabled===false?'off':'on');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="ivory"
      data-contrast="normal"
      data-font-size="medium"
      data-animations="on"
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a href="#main" className="skip-link">
          Skip to calculator
        </a>
        <ThemeManager />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
