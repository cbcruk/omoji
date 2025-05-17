import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_Mono } from 'next/font/google'
import { Aside } from '../components/aside/aside'
import { RootLayoutProps } from './types'
import { Header } from '../components/header/header'
import { IconSizeContextProvider } from '@/context/icon-size-context'

const notoSansMono = Noto_Sans_Mono({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | 오픈모지',
    default: '오픈모지',
  },
  description: '',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={notoSansMono.className}>
        <IconSizeContextProvider>
          <div className="flex flex-col">
            <header className="sticky top-0 h-[66px] p-4">
              <Header />
            </header>
            <div className="flex gap-4 max-h-[calc(100vh-66px)]">
              <aside className="p-4 overflow-auto">
                <Aside />
              </aside>
              <main className="p-4 overflow-auto flex-1">{children}</main>
            </div>
            <footer />
          </div>
        </IconSizeContextProvider>
      </body>
    </html>
  )
}
