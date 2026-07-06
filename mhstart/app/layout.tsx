import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'MHStart - Empowering Maharashtra Startups',
  description: "Maharashtra's premier startup ecosystem platform — connecting startups, incubators, investors, and enablers.",
  keywords: 'Maharashtra startups, incubators, investors, startup ecosystem, MHStart',
  openGraph: {
    title: 'MHStart',
    description: "Maharashtra's Startup Ecosystem",
    type: 'website',
  },
   icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: 'Mukta, sans-serif', borderRadius: '8px' },
          success: { iconTheme: { primary: '#FF6B35', secondary: 'white' } }
        }} />
      </body>
    </html>
  )
}
