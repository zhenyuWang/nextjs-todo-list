'use client'

import { SignIn } from '@clerk/nextjs'

function SignInPage() {
  return (
    <div className='h-full flex items-center justify-center bg-gradient-to-r from-[#ecddfa] to-[#7ccdf5] dark:from-[#330066] dark:to-[#000]'>
      <SignIn />
    </div>
  )
}

export default SignInPage
