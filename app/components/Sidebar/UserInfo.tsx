'use client'

import { useEffect, useState } from 'react'
import { Image } from '@nextui-org/react'
import { getCurrentUser } from '@/app/lib/actions'

type User = {
  id: string
  avatar: string
  firstName: string
  lastName: string
  email: string
}

export default function UserInfo() {
  const [user, setUser] = useState({
    id: '',
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
  } as User)

  useEffect(() => {
    const getUser = async () => {
      const userInfo = await getCurrentUser()
      if (userInfo) {
        setUser(userInfo.user as User)
      }
    }

    getUser()
  }, [])

  return (
    <div className='mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center'>
      <Image
        className='w-14 sm:w-20 h-14 sm:h-20'
        radius='full'
        isZoomed={true}
        src={user?.avatar}
        alt='avatar'
      />
      <div className='ml-4 mt-4 sm:mt-0'>
        <span>{user?.firstName}</span>
        <br />
        <span>{user?.lastName}</span>
      </div>
    </div>
  )
}
