import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import authConfig from './auth.config'
import { base64ToLocalImg, connectToDB } from './app/lib/utils'
import bcrypt from 'bcrypt'
import { User } from './app/lib/models'
import { updateUser } from './app/lib/actions'
import { isBase64Img } from './app/utils/tools'

let loginErrorMsg = ''
export const getLoginErrorMsg = () => loginErrorMsg

const login = async (credentials: any) => {
  try {
    connectToDB()
    const user = await User.findOne({ email: credentials.email })
    if (!user) throw new Error('The user does not exist!')

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password,
    )

    if (!isPasswordCorrect) throw new Error('Wrong password!')

    if (isBase64Img(user.avatar)) {
      await updateUser({
        id: user._id,
        avatar: user.avatar,
      })
      user.avatar = `/users/${user._id.toString()}-avatar.png`
    }
    return user
  } catch (err: any) {
    throw new Error(err.message)
  }
}

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          return await login(credentials)
        } catch (err: any) {
          loginErrorMsg = err.message
          return null
        }
      },
    }),
  ],
  // ADD ADDITIONAL INFORMATION TO SESSION
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user._id
        token.avatar = user.avatar
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
      }
      return token
    },
    // @ts-ignore
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id
        session.user.avatar = token.avatar
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.email = token.email
      }
      return session
    },
  },
})
