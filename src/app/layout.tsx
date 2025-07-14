import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fitness Tracker',
  description: 'Personal fitness tracking app for workouts and progress',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['fitness', 'workout', 'tracker', 'exercise', 'health'],
  authors: [{ name: 'Fitness Tracker' }],
  themeColor: '#0ea5e9',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fitness Tracker',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Fitness Tracker" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fitness Tracker" />
        <meta name="description" content="Personal fitness tracking app for workouts and progress" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#0ea5e9" />
        
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#0ea5e9" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Fitness Tracker" />
        <meta name="twitter:description" content="Personal fitness tracking app for workouts and progress" />
        <meta name="twitter:image" content="/icons/icon-192x192.png" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fitness Tracker" />
        <meta property="og:description" content="Personal fitness tracking app for workouts and progress" />
        <meta property="og:site_name" content="Fitness Tracker" />
        <meta property="og:image" content="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">
        <div id="app-root" className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
} 