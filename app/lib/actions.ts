'use server'

import path from 'path'
import fs from 'fs'
import { revalidatePath } from 'next/cache'
import { User, Task } from './models'
import { base64ToLocalImg, connectToDB } from './utils'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { auth, signIn, signOut, getLoginErrorMsg } from '@/auth'
import { isBase64Img } from '../utils/tools'

const EMAIL_VERIFICATION_CODE_EXPIRY = 60 * 1000
const EMAIL_VERIFICATION_CODE_MAP = new Map()

const generateVerificationCode = () => {
  return Math.round(100000 + Math.random() * 900000)
}

export const generateEmailVerificationCode = (email: string) => {
  if (EMAIL_VERIFICATION_CODE_MAP.has(email)) {
    const preCodeInfo = EMAIL_VERIFICATION_CODE_MAP.get(email)
    const now = Date.now()
    if (now - preCodeInfo.time < EMAIL_VERIFICATION_CODE_EXPIRY) {
      return { errMsg: 'Please wait for a while before requesting a new code.' }
    }
    const code = generateVerificationCode()
    EMAIL_VERIFICATION_CODE_MAP.set(email, { code, time: now })
    return { code }
  }
  const code = generateVerificationCode()
  EMAIL_VERIFICATION_CODE_MAP.set(email, { code, time: Date.now() })

  setTimeout(() => {
    EMAIL_VERIFICATION_CODE_MAP.delete(email)
  }, EMAIL_VERIFICATION_CODE_EXPIRY)

  return { code }
}

export const createUser = async (userInfo: any) => {
  const { avatar, firstName, lastName, email, password, verificationCode } =
    userInfo

  if (!EMAIL_VERIFICATION_CODE_MAP.has(email)) {
    return { errMsg: 'Please request a verification code first.' }
  }

  const codeInfo = EMAIL_VERIFICATION_CODE_MAP.get(email)
  if (codeInfo.code != verificationCode) {
    return { errMsg: 'Invalid verification code.' }
  }

  try {
    connectToDB()

    const user = await User.findOne({ email: userInfo.email })
    if (user) {
      return { errMsg: 'User already exists.' }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      avatar,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    await newUser.save()
    await authenticate({ email, password })
    revalidatePath('/tasks')
    redirect('/tasks')
  } catch (err) {
    console.log('createUser error:', err)
    return { errMsg: 'Failed to create user!' }
  }
}

export const deleteUser = async (id: string) => {
  try {
    connectToDB()

    await User.findByIdAndDelete(id)
    const avatarPath = path.join(
      process.cwd(),
      'public',
      'users',
      `${id}-avatar.png`,
    )

    fs.access(avatarPath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(avatarPath, (err) => {
          if (err) {
            console.error(`Error deleting ${avatarPath}: ${err}`)
          }
        })
      } else {
        console.log('File does not exist.')
      }
    })
    revalidatePath('/dashboard/users')
  } catch (err) {
    // TODO: optimize request failure interactions
    console.log(err)
    return { errMsg: 'Failed to delete user!' }
  }
}

export const updateUser = async (userInfo: any) => {
  const { id, avatar, firstName, lastName } = userInfo

  const changedAvatarPath = path.join(
    process.cwd(),
    'public',
    'users',
    `${id}-avatar.png`,
  )
  console.log('changedAvatarPath:', changedAvatarPath)
  let isAvatarChanged = false

  try {
    connectToDB()
    if (isBase64Img(avatar)) {
      // Dynamic file creation is not supported on vercel, so the logic is not valid after deployment
      // If you want to update your avatar, you need to upload it to the GitHub repository based on the user.id
      const dir = path.join(process.cwd(), 'public', 'users')
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      const { errMsg } = base64ToLocalImg(avatar, changedAvatarPath)
      if (errMsg) return { errMsg }

      isAvatarChanged = true
    }

    const updateFields = {}

    if (avatar) {
      // @ts-expect-error
      updateFields.avatar = avatar
    }
    if (firstName) {
      // @ts-expect-error
      updateFields.firstName = firstName
    }
    if (lastName) {
      // @ts-expect-error
      updateFields.lastName = lastName
    }
    if (isAvatarChanged) {
      // @ts-expect-error
      updateFields.avatar = changedAvatarPath.replace('./public', '')
    }
    const user = await User.findByIdAndUpdate(id, updateFields)
    return {
      user: {
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }
  } catch (err) {
    console.log('updateUser error:', err)
    return { errMsg: 'Failed to update user!' }
  }
}

export const updateUserPassword = async (formData: any) => {
  const { email, password, verificationCode } = formData
  if (!EMAIL_VERIFICATION_CODE_MAP.has(email)) {
    return { errMsg: 'Please request a verification code first.' }
  }

  const codeInfo = EMAIL_VERIFICATION_CODE_MAP.get(email)
  if (codeInfo.code != verificationCode) {
    return { errMsg: 'Invalid verification code.' }
  }

  try {
    connectToDB()
    const user = await User.findOne({ email })
    if (!user) {
      return { errMsg: 'The user does not exist.' }
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    await User.findByIdAndUpdate(user._id, { password: hashedPassword })
  } catch (err) {
    console.log('updateUser error:', err)
    return { errMsg: 'Failed to change password!' }
  }
}

export const fetchTasks = async ({
  keyword = '',
  status = -1,
  isImportant,
  pageNum = 1,
  pageSize = 10000,
}: {
  keyword?: string
  status?: number
  isImportant?: boolean
  pageNum?: number
  pageSize?: number
}) => {
  const regex = new RegExp(keyword, 'i')

  try {
    connectToDB()
    // @ts-expect-error
    const { user } = await auth()
    const query = {
      $or: [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
      ],
      userId: user.id,
    }
    if (status >= 0) {
      // @ts-expect-error
      query.status = status
    }
    if (typeof isImportant === 'boolean') {
      // @ts-expect-error
      query.isImportant = isImportant
    }

    const tasks = await Task.find(query)
      .limit(pageSize)
      .skip(pageSize * (pageNum - 1))
    return { tasks }
  } catch (err) {
    console.log(err)
    return { errMsg: 'Failed to fetch tasks!' }
  }
}

export const fetchTask = async (id: string) => {
  try {
    connectToDB()
    return await Task.findById(id)
  } catch (err) {
    console.log(err)
    return { errMsg: 'Failed to fetch task!' }
  }
}

export const createTask = async (taskInfo: any) => {
  const { title, description, deadline, status, isImportant } = taskInfo

  try {
    connectToDB()

    // @ts-expect-error
    const { user } = await auth()

    const newTask = new Task({
      userId: user.id,
      title,
      description,
      deadline,
      status,
      isImportant,
    })
    await newTask.save()
    revalidatePath('/tasks')
  } catch (err) {
    // TODO: optimize request failure interactions
    console.log(err)
    return { errMsg: 'Failed to create task!' }
  }
}

export const deleteTask = async (id: string) => {
  try {
    connectToDB()

    await Task.findByIdAndDelete(id)
    revalidatePath('/tasks')
    return {}
  } catch (err) {
    // TODO: optimize request failure interactions
    console.log(err)
    return { errMsg: 'Failed to delete task!' }
  }
}

export const updateTask = async (taskInfo: any) => {
  try {
    connectToDB()
    const { _id, title, description, deadline, status, isImportant } = taskInfo
    const updateFields = {
      title,
      description,
      deadline,
      status,
      isImportant,
    }

    await Task.findByIdAndUpdate(_id, updateFields)
    revalidatePath('/tasks')
    return {}
  } catch (err) {
    console.log(err)
    return { errMsg: 'Failed to update task!' }
  }
}

export const authenticate = async (formData: any) => {
  const { email, password } = formData
  try {
    await signIn('credentials', { email, password })
  } catch (err) {
    return getLoginErrorMsg()
  }
}

export const getCurrentUser = async () => {
  return await auth()
}

export async function triggerSignOut() {
  await signOut()
}
