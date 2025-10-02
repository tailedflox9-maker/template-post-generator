// FILE: app/layout.tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Post Generator',
  description: 'Create stunning carousel posts with an easy-to-use editor.',
  generator: 'v0.app',
  // FIX: Added the icon link back in.
  // Make sure 'web-design.png' is in your /public folder.
  icons: {
    icon: '/web-design.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
    </html>
  )
}
