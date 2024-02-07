'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import GitHubLink from '@/app/components/GitHubLink'
import ThemeSwitch from '@/app/components/ThemeSwitch'
import FormInput from '@/app/components/Form/FormInput'
import { signInFormValidationRules } from '@/app/utils/form'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import Confetti from 'react-dom-confetti'
import { Spinner, Button, Link } from '@nextui-org/react'
import { toast } from 'react-toastify'
import { authenticate } from '@/app/lib/actions'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/actions'
import { useTheme } from '@/app/context/theme-context'

const SignInPage = () => {
  const router = useRouter()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkIsLogin = async () => {
      const user = await getCurrentUser()
      if (user) {
        router.replace('/tasks')
      } else {
        setLoading(false)
      }
    }
    checkIsLogin()
  }, [router])

  const [submitting, setSubmitting] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const [isVisiblePassword, setIsVisiblePassword] = useState(false)
  const togglePasswordVisibility = () =>
    setIsVisiblePassword(!isVisiblePassword)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleLogin = async (data: any) => {
    setSubmitting(true)
    const errMsg = await authenticate(data)
    if (errMsg) {
      toast.error(errMsg, {
        position: 'top-center',
        autoClose: 2000,
        theme,
      })
    } else {
      setLoginSuccess(true)
      setTimeout(() => {
        router.replace('/tasks')
      }, 2000)
    }
    setSubmitting(false)
  }

  if (loading)
    return (
      <div className='pt-10 flex justify-center'>
        <Spinner />
      </div>
    )

  return (
    <div className='h-[100vh] flex items-center justify-center overflow-hidden'>
      <div className='fixed top-4 right-4'>
        <GitHubLink />
        <ThemeSwitch />
      </div>
      <div className='w-[300px] md:w-[35%] min-w-[300px'>
        <h1 className='pb-8 text-center text-3xl font-bold'>Sign In</h1>
        <form onSubmit={handleSubmit(handleLogin)}>
          <FormInput
            label='Email'
            placeholder='please input your email'
            type='email'
            register={register}
            name='email'
            validationRule={signInFormValidationRules['email']}
            error={errors.email}
          />
          <FormInput
            label='Password'
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
            validationRule={signInFormValidationRules['password']}
            type={isVisiblePassword ? 'text' : 'password'}
            error={errors.password}
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
                active={loginSuccess}
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
          <Link href='/forget-password'>Forget Password?</Link>
          <Link href='/sign-up'>Sign Up</Link>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
