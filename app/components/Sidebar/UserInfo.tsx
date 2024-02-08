'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Image } from '@nextui-org/react'
import { FaUserEdit } from 'react-icons/fa'
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
        localStorage.setItem('userInfo', JSON.stringify(userInfo.user))
      }
    }
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      setUser(JSON.parse(userInfo))
    } else {
      getUser()
    }
  }, [])

  const router = useRouter()

  const goEditProfile = () => {
    router.push(
      `/edit-profile?id=${user.id}&avatar=${user.avatar}&firstName=${user.firstName}&lastName=${user.lastName}`,
    )
  }

  return (
    <div
      className='mt-5 sm:mt-6 relative flex flex-col sm:flex-row items-center justify-center cursor-pointer'
      onClick={goEditProfile}
    >
      <Image
        className='w-14 sm:w-20 h-14 sm:h-20'
        radius='full'
        isZoomed={true}
        src={user.avatar || 'no-avatar.png'}
        alt='avatar'
      />
      <FaUserEdit
        size={24}
        className='absolute top-10 sm:top-12 left-30 z-10'
      />
      <div className='ml-4 mt-4 sm:mt-0'>
        <span>{user?.firstName}</span>
        <br />
        <span>{user?.lastName}</span>
      </div>
    </div>
  )
}
