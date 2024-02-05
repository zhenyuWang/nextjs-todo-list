'use client'

import Sidebar from '@/app/components/Sidebar/Sidebar'
import { useUser } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSignedIn } = useUser()

  return (
    <div className='h-[100vh] flex px-5 py-5 overflow-hidden'>
      <Sidebar />
      {isSignedIn ? (<div className='h-full flex-1 bg-slate-700 border border-slate-500 rounded-md overflow-hidden'>
        {children}
      </div>) : <div className='w-full pt-10 text-center'>loading...</div>}
    </div>
  )
}
