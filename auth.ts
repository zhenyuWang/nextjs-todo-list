import fs from 'fs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import authConfig from './auth.config'
import { connectToDB } from './app/lib/utils'
import bcrypt from 'bcrypt'
import { User } from './app/lib/models'

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
          const user = await login(credentials)
          if (user?.avatar.startsWith('data:image')) {
            const base64Data = user?.avatar.replace(
              /^data:image\/\w+;base64,/,
              '',
            )
            let dataBuffer = Buffer.from(base64Data, 'base64')

            // Write buffer to file
            try {
              fs.writeFileSync(
                `./public/users/${user.id}-avatar.png`,
                dataBuffer,
              )
              user._doc.avatar = `/users/${user.id}-avatar.png`
            } catch (err) {
              console.log('write user avatar fail', err)
            }
          }
          return user
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
        token.id = user.id
        token.avatar = user._doc.avatar
        token.firstName = user._doc.firstName
        token.lastName = user._doc.lastName
        token.email = user._doc.email
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
        session.user.email = token.email + '123'
      }
      return session
    },
  },
})
