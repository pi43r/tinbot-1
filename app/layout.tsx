import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GOAT',
  description: 'goat boat for tintin patrone',
  viewport: 'width=device-width, initial-scale=1',
  icons: '/favicon.ico',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className={inter.className}>{children}</main>
      </body>
    </html>
  )
}
