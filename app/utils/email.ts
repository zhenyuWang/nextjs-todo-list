import { generateEmailVerificationCode } from '../lib/actions'
import { toast } from 'react-toastify'
import emailjs from '@emailjs/browser'
import { Dispatch, SetStateAction } from 'react'

export const getEmailVerificationCode = async (
  email: string,
  theme: string,
) => {
  const { errMsg, code } = await generateEmailVerificationCode(email)
  if (errMsg) {
    toast.error(errMsg, {
      position: 'top-center',
      autoClose: 2000,
      theme,
    })
    return false
  }
  return code
}

export const setSendCodeButtonTextTimer = (
  duration: number,
  setSendCodeButtonText: Dispatch<SetStateAction<string>>,
) => {
  let count = duration - 1
  setSendCodeButtonText(`${60}s`)
  const timer = setInterval(() => {
    if (count > 0) {
      count--
      setSendCodeButtonText(`${count}s`)
    } else {
      clearInterval(timer)
      setSendCodeButtonText('Send code')
    }
  }, 1000)
}

export const sendVerificationCodeByEmail = async (
  email: string,
  code: number,
  theme: string,
) => {
  emailjs
    .send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to: email,
        from: process.env.NEXT_PUBLIC_EMAILJS_FROM_EMAIL,
        fromName: process.env.NEXT_PUBLIC_MY_NAME,
        code,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    )
    .then(
      () => {
        toast.success('Verification code sent successfully.', {
          position: 'top-center',
          autoClose: 3000,
          theme,
        })
      },
      (error: any) => {
        console.log('sendEmailCode error:', error)
        toast.error('Oh, something went wrong. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
          theme,
        })
      },
    )
}
