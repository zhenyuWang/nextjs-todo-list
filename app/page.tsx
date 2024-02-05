'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { isSignedIn } = useUser()

  useEffect(() => {
    isSignedIn ? router.replace('/tasks') : router.replace('/sign-in')
  }, [isSignedIn])
}
