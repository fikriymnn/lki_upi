import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavbarCustom from '@/components/Navbar'
import FooterCustom from '@/components/FooterCustom'
import { UserProvider } from '@/context/userContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LKI UPI',
  description: 'LAB KIMIA UNIVERSITAS PENDIDIKAN INDONESIA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/logo.svg" sizes="any" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <NavbarCustom />
          <div className='md:pt-[10vh] lg:pt-[10vh] pt-[9vh]'>
            {children}
          </div>

          <FooterCustom />
        </UserProvider>
      </body>
    </html>
  )
}
