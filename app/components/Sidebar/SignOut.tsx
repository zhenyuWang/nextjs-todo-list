'use client'

import { PiSignOutBold } from 'react-icons/pi'
import { triggerSignOut } from '@/app/lib/actions'

export default function SignOut() {
  return (
    <div
      className={`p-4 flex items-center text-slate-200 hover:text-sky-500 cursor-pointer`}
      onClick={() => triggerSignOut()}
    >
      <PiSignOutBold size={20} />
      <span className='pl-3'>Sign Out</span>
    </div>
  )
}
