'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Image, Link } from '@nextui-org/react'
import {
  MdMenu,
  MdClose,
  MdHome,
  MdNotificationImportant,
  MdDone,
  MdCleaningServices,
  MdDelete,
} from 'react-icons/md'
import { PiSignOutBold } from 'react-icons/pi'

function Sidebar() {
  const menu = [
    {
      id: 1,
      title: 'All Tasks',
      icon: MdHome,
      link: '/tasks',
    },
    {
      id: 2,
      title: 'Important',
      icon: MdNotificationImportant,
      link: '/tasks/important',
    },
    {
      id: 3,
      title: 'Doing',
      icon: MdCleaningServices,
      link: '/tasks/doing',
    },
    {
      id: 4,
      title: 'Completed',
      icon: MdDone,
      link: '/tasks/completed',
    },
    {
      id: 5,
      title: 'Deleted',
      icon: MdDelete,
      link: '/tasks/deleted',
    },
  ]

  const [collapsed, setCollapsed] = useState(false)

  const collapseMenu = () => {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    function handleWindowResize() {
      if (window.innerWidth < 640) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
      }
    }
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [collapsed])

  const pathname = usePathname()

  return (
    <div
      className={`${
        collapsed
          ? 'mr-0 translate-x-[-160px] sm:translate-x-[-26px]'
          : 'mr-5 translate-x-0'
      } w-[160px] sm:w-[240px] sm:h-full fixed sm:relative top-10 sm:top-0 left-0 z-50 flex flex-col py-2 justify-between bg-slate-800 sm:bg-slate-700 border border-slate-500 rounded-md transition-all`}
    >
      <div
        className={`flex sm:hidden w-9 h-10 absolute right-[-36px] top-6 z-10 items-center justify-center bg-slate-700 rounded-2 border border-slate-500 ${
          collapsed ? '' : 'border-l-0'
        }`}
        onClick={collapseMenu}
      >
        {collapsed ? (
          <MdMenu className='animate-scale-up-down' />
        ) : (
          <MdClose className='animate-scale-up-down' />
        )}
      </div>
      <div>
        <div className='mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center'>
          <Image
            className='w-14 sm:w-20 h-14 sm:h-20'
            radius='full'
            isZoomed={true}
            src='https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='avatar'
          />
          <div className='ml-4 mt-4 sm:mt-0'>
            <span>Running</span>
            <br />
            <span>Snail</span>
          </div>
        </div>
        <div className='pt-10'>
          {menu.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.link}
                className={`flex p-4 ${
                  pathname === item.link
                    ? 'bg-slate-900 sm:bg-slate-800 border-r-4 border-lime-300'
                    : ''
                } text-slate-200 hover:text-sky-500`}
              >
                <item.icon size={20} />
                <span className='pl-3'>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
      <div
        className={`p-4 flex items-center text-slate-200 hover:text-sky-500 cursor-pointer}`}
      >
        <PiSignOutBold size={20} />
        <span className='pl-3'>Sign Out</span>
      </div>
    </div>
  )
}

export default Sidebar