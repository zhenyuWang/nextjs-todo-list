import Sidebar from '@/app/components/Sidebar/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-[100vh] flex px-5 py-5 overflow-hidden'>
      <Sidebar />
      <div className='h-full flex-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-500 rounded-md overflow-hidden'>
        {children}
      </div>
    </div>
  )
}
