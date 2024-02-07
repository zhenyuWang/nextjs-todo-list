'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
// import GitHubLink from '@/app/components/GitHubLink'
// import ThemeSwitch from '@/app/components/ThemeSwitch'
import FormInput from '@/app/components/Form/FormInput'
import { signUpFormValidationRules } from '@/app/utils/form'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import Confetti from 'react-dom-confetti'
import { Button, Link } from '@nextui-org/react'
import { toast } from 'react-toastify'
import { getEmailVerificationCode, updateUserPassword } from '@/app/lib/actions'
import { validateEmail } from '../utils/tools'
import emailjs from '@emailjs/browser'

const SignUpPage = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [sendCodeButtonText, setSendCodeButtonText] = useState('Send code')

  const [isVisiblePassword, setIsVisiblePassword] = useState(false)
  const togglePasswordVisibility = () =>
    setIsVisiblePassword(!isVisiblePassword)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const sendEmailCode = async () => {
    const { errMsg, code } = await getEmailVerificationCode(email)
    if (errMsg) {
      return toast.error(errMsg, {})
    }

    let count = 59
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
          })
        },
        (error: any) => {
          console.log('sendEmailCode error:', error)
          toast.error('Oh, something went wrong. Please try again.', {
            position: 'top-center',
            autoClose: 3000,
          })
        },
      )
  }

  const submit = async (data: any) => {
    setSubmitting(true)
    const res = await updateUserPassword(data)
    if (res?.errMsg) {
      toast.error(res.errMsg, {
        position: 'top-center',
        autoClose: 2000,
        theme: 'dark',
      })
    } else {
      setSignUpSuccess(true)
      setTimeout(() => {
        router.replace('/sign-in')
      }, 1000)
    }
    setSubmitting(false)
  }

  return (
    <div className='h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#ecddfa] to-[#7ccdf5] dark:from-[#330066] dark:to-[#000]'>
      <div className='fixed top-4 right-4'>
        {/* <GitHubLink />
        <ThemeSwitch /> */}
      </div>
      <div className='w-[300px] md:w-[35%] min-w-[300px'>
        <h1 className='pb-8 text-center text-3xl font-bold'>Forget Password</h1>
        <form onSubmit={handleSubmit(submit)}>
          <FormInput
            label='Email'
            placeholder='please input your email'
            type='email'
            register={register}
            name='email'
            onChange={(val) => {
              setEmail(val)
              setIsEmailValid(validateEmail(val))
            }}
            validationRule={signUpFormValidationRules['email']}
            error={errors.email}
          />
          <FormInput
            label='New Password'
            placeholder='please input your password'
            description='8~20 non-space characters'
            register={register}
            name='password'
            endContent={
              <div
                className='focus:outline-none cursor-pointer'
                onClick={togglePasswordVisibility}
              >
                {isVisiblePassword ? (
                  <AiFillEye className='text-2xl text-default-400 pointer-events-none' />
                ) : (
                  <AiFillEyeInvisible className='text-2xl text-default-400 pointer-events-none' />
                )}
              </div>
            }
            validationRule={signUpFormValidationRules['password']}
            type={isVisiblePassword ? 'text' : 'password'}
            error={errors.password}
          />
          <FormInput
            label='Verification Code'
            placeholder='verification code'
            description='Six-digit number'
            register={register}
            name='verificationCode'
            endContent={
              <Button
                color='primary'
                variant='light'
                isDisabled={sendCodeButtonText !== 'Send code' || !isEmailValid}
                onClick={sendEmailCode}
              >
                {sendCodeButtonText}
              </Button>
            }
            validationRule={signUpFormValidationRules['verificationCode']}
            error={errors.verificationCode}
          />
          <div className='relative'>
            <Button
              className='w-full mt-6'
              color='primary'
              isLoading={submitting}
              disabled={submitting}
              type='submit'
            >
              Submit
            </Button>
            <div className='absolute left-[50%] top-[50%]'>
              <Confetti
                active={signUpSuccess}
                config={{
                  angle: 90,
                  spread: 360,
                  startVelocity: 45,
                  elementCount: 1000,
                  stagger: 0,
                  width: '10px',
                  height: '10px',
                  dragFriction: 0.1,
                }}
              />
            </div>
          </div>
        </form>
        <div className='mt-2 flex justify-between'>
          <Link href='/sign-in'>Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
