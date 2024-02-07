'use client'

import { useEffect, useState } from 'react'
import { MdMenu, MdClose } from 'react-icons/md'

import UserInfo from './UserInfo'
import Menus from './Menus'
import SignOut from './SignOut'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true)

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
        <UserInfo />
        <Menus closeSidebar={() => setCollapsed(true)} />
      </div>
      <SignOut />
    </div>
  )
}
