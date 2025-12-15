import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import '../../styles/globals.css'
import localFont from 'next/font/local'
import { inter } from '@/config/font'

const satoshi = localFont({
  src: '../../fonts/Satoshi-Variable.ttf',
  variable: '--satoshi',
  display: 'swap',
})
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <body className={`${inter.variable} ${satoshi.variable} flex flex-col`}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MZ3N2ZRZ"
height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>

      <Header />
      <main>{children}</main>
      <Footer />
    </body>  )
}
