'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  MdHome,
  MdNotificationImportant,
  MdDone,
  MdCleaningServices,
  MdDelete,
} from 'react-icons/md'

export default function Menus({ closeSidebar }: { closeSidebar: () => void }) {
  const router = useRouter()

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
      title: 'Pending',
      icon: MdCleaningServices,
      link: '/tasks/pending',
    },
    {
      id: 4,
      title: 'Doing',
      icon: MdCleaningServices,
      link: '/tasks/doing',
    },
    {
      id: 5,
      title: 'Completed',
      icon: MdDone,
      link: '/tasks/completed',
    },
    {
      id: 6,
      title: 'Deleted',
      icon: MdDelete,
      link: '/tasks/deleted',
    },
  ]

  const pathname = usePathname()

  return (
    <div className='pt-10'>
      {menu.map((item) => {
        return (
          <div
            key={item.id}
            className={`flex p-4 ${
              pathname === item.link
                ? 'bg-slate-300 dark:bg-slate-900 sm:dark:bg-slate-800 border-r-4 border-lime-300'
                : ''
            } text-slate-500 dark:text-slate-200 hover:text-sky-500 cursor-pointer`}
            onClick={() => {
              closeSidebar()
              router.push(item.link)
            }}
          >
            <item.icon size={20} />
            <span className='pl-3'>{item.title}</span>
          </div>
        )
      })}
    </div>
  )
}
