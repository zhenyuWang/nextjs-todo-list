'use server'

import fs from 'fs'
import { revalidatePath } from 'next/cache'
import { User, Task } from './models'
import { connectToDB } from './utils'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { auth, signIn, signOut, getLoginErrorMsg } from '@/auth'

const EMAIL_VERIFICATION_CODE_EXPIRY = 60 * 1000 // 1 minute
const EMAIL_VERIFICATION_CODE_MAP = new Map()

const generateVerificationCode = () => {
  return Math.round(100000 + Math.random() * 900000)
}

export const getEmailVerificationCode = (email) => {
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

export const createUser = async (userInfo) => {
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
  } catch (err) {
    console.log('createUser error:', err)
    return { errMsg: 'Failed to create user!' }
  }

  revalidatePath('/tasks')
  redirect('/tasks')
}

export const deleteUser = async (id) => {
  try {
    connectToDB()

    await User.findByIdAndDelete(id)
    const avatarPath = `./public/users/${id}-avatar.png`

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
  } catch (err) {
    // TODO: optimize request failure interactions
    console.log(err)
    throw new Error('Failed to delete user!')
  }

  revalidatePath('/dashboard/users')
}

export const updateUser = async (userInfo) => {
  const { id, img, firstName, lastName, email, password } = userInfo

  let changedAvatarPath = `./public/users/${id}-avatar.png`
  let isAvatarChanged = false

  try {
    connectToDB()
    if (img?.startsWith('data:image')) {
      const base64Data = img.replace(/^data:image\/\w+;base64,/, '')
      let dataBuffer = Buffer.from(base64Data, 'base64')

      // Write buffer to file
      try {
        fs.writeFileSync(changedAvatarPath, dataBuffer)

        isAvatarChanged = true
      } catch (err) {
        console.log('write user avatar fail', err)
      }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = password ? await bcrypt.hash(password, salt) : ''

    const updateFields = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }

    if (isAvatarChanged) {
      updateFields.img = changedAvatarPath.replace('./public', '')
    }
    if (!password) {
      delete updateFields.password
    }

    await User.findByIdAndUpdate(id, updateFields)
  } catch (err) {
    console.log(err)
    throw new Error('Failed to update user!')
  }

  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}

export const createTask = async (taskInfo) => {
  const { title, description, deadline, status, isImportant } = taskInfo

  try {
    connectToDB()

    const newTask = new Task({
      title,
      description,
      deadline,
      status,
      isImportant,
    })

    await newTask.save()
  } catch (err) {
    // TODO: optimize request failure interactions
    console.log(err)
    return { errMsg: 'Failed to create task!' }
  }

  revalidatePath('/tasks')
  redirect('/tasks')
}

export const deleteTask = async (id) => {
  try {
    connectToDB()

    await Task.findByIdAndDelete(id)
  } catch (err) {
    // TODO: optimize request failure interactions
    console.log(err)
    throw new Error('Failed to delete task!')
  }

  revalidatePath('/tasks')
}

export const updateTask = async (taskInfo) => {
  const { title, description, deadline, status, isImportant } = taskInfo

  try {
    connectToDB()

    const updateFields = {
      title,
      description,
      deadline,
      status,
      isImportant,
    }

    await Task.findByIdAndUpdate(id, updateFields)
  } catch (err) {
    console.log(err)
    throw new Error('Failed to update task!')
  }

  revalidatePath('/dashboard/tasks')
  redirect('/dashboard/tasks')
}

export const authenticate = async (formData) => {
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
