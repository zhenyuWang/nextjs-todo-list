import type { NextAuthConfig } from 'next-auth'

const whiteList = new Set(['/sign-up', '/forget-password', '/reset-password'])

export default {
  providers: [],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    authorized({ auth, request }: { auth: any; request: any }) {
      const isLoggedIn = !!auth?.user

      if (whiteList.has(request.nextUrl.pathname)) {
        return isLoggedIn
          ? Response.redirect(new URL('/tasks', request.nextUrl))
          : true
      }

      const isOnLogin = request.nextUrl.pathname.startsWith('/sign-in')
      if (!isOnLogin) {
        return isLoggedIn
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/tasks', request.nextUrl))
      }
      return true
    },
  },
} satisfies NextAuthConfig
