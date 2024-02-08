'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import GitHubLink from '@/app/components/GitHubLink'
import ThemeSwitch from '@/app/components/ThemeSwitch'
import FormInput from '@/app/components/Form/FormInput'
import { signUpFormValidationRules } from '@/app/utils/form'
import Confetti from 'react-dom-confetti'
import { Image, Button } from '@nextui-org/react'
import Link from 'next/link'
import { MdCloudUpload } from 'react-icons/md'
import { toast } from 'react-toastify'
import { updateUser } from '@/app/lib/actions'
import { useTheme } from '@/app/context/theme-context'
import { useRouter, useSearchParams } from 'next/navigation'

const SignUpPage = () => {
  const router = useRouter()

  const params = useSearchParams()
  const userId = params.get('id')
  const firstName = params.get('firstName')
  const lastName = params.get('lastName')

  const { theme } = useTheme()
  const [avatar, setAvatar] = useState(params.get('avatar'))
  const [submitting, setSubmitting] = useState(false)
  const [editProfileSuccess, setEditProfileSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleAvatarChange = async (e: any) => {
    if (e.target.files?.length) {
      const reader = new FileReader()
      reader.addEventListener('load', async () => {
        if ((reader.result as string).length > 1024 * 1024 * 1) {
          toast.warn('Image size should be less than 1MB', {
            position: 'top-center',
            autoClose: 2000,
            theme,
          })
        } else {
          setAvatar(reader.result as string)
        }
        // Prevent if the resource is selected twice, onChange is not triggered
        e.target.value = ''
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleEditProfile = async (data: any) => {
    setSubmitting(true)
    const { user, errMsg } = await updateUser({ avatar, ...data, id: userId })
    if (errMsg) {
      toast.error(errMsg, {
        position: 'top-center',
        autoClose: 2000,
        theme,
      })
    } else {
      setEditProfileSuccess(true)
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...user }))
      router.replace('/tasks')
    }
    setSubmitting(false)
  }

  return (
    <div className='h-[100vh] flex items-center justify-center overflow-hidden'>
      <div className='fixed top-4 right-4'>
        <GitHubLink />
        <ThemeSwitch />
      </div>
      <div className='w-[300px] md:w-[35%] min-w-[300px'>
        <h1 className='pb-8 text-center text-3xl font-bold'>Edit Profile</h1>
        <div className='w-[100px] h-[100px] mx-auto mb-10 relative '>
          <Image
            src={avatar || '/no-avatar.png'}
            radius='full'
            className='w-[100px] h-[100px]'
            alt='avatar'
          />
          <MdCloudUpload
            className='absolute bottom-0 right-0 z-10 text-slate-400'
            size={26}
          />
          <input
            accept='image/*'
            id='avatar-upload'
            type='file'
            className='w-[100px] h-[100px] absolute top-0 left-0  opacity-0 z-20 cursor-pointer'
            onChange={handleAvatarChange}
          />
        </div>
        <form onSubmit={handleSubmit(handleEditProfile)}>
          <FormInput
            label='First Name'
            placeholder='please input your first name'
            register={register}
            name='firstName'
            defaultValue={firstName || ''}
            validationRule={signUpFormValidationRules['firstName']}
            error={errors.firstName}
          />
          <div className='mt-10'></div>
          <FormInput
            label='Last Name'
            placeholder='please input your last name'
            register={register}
            name='lastName'
            defaultValue={lastName || ''}
            validationRule={signUpFormValidationRules['lastName']}
            error={errors.lastName}
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
                active={editProfileSuccess}
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
          <Link href='/tasks' className='text-blue-500'>
            back
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
