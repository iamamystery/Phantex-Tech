import React from 'react'
import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TechMarquee } from '@/components/layout/TechMarquee'
import { ThemeProvider } from '@/components/theme-provider'

// ─── Fonts ────────────────────────────────────────────────────────────────────
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

// ─── Default Metadata ─────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Phantex Tech — We Build What Powers You',
    template: '%s | Phantex Tech',
  },
  description:
    'Phantex Tech is a web automation agency helping SaaS startups scale with web scraping, AI pipelines, backend systems, and custom automation.',
  metadataBase: new URL('https://phantextech.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://phantextech.com',
    siteName: 'Phantex Tech',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <TechMarquee />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
