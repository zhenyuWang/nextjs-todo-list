'use client'

import Sidebar from '@/app/components/Sidebar/Sidebar'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  type Theme = 'light' | 'dark'
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localTheme = window.localStorage.getItem('theme') as Theme | null

      if (localTheme) {
        if (localTheme === 'dark') {
          document.documentElement.classList.add('dark')
        }
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  return (
    <div className='h-[100vh] flex px-5 py-5 overflow-hidden'>
      <Sidebar />
      <div className='h-full flex-1 bg-slate-700 border border-slate-500 rounded-md overflow-hidden'>
        {children}
      </div>
    </div>
  )
}
