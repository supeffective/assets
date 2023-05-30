import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-between p-6 lg:px-24 ${inter.className}`}
    >
      {children}
    </div>
  )
}
