import { authMiddleware } from '@clerk/nextjs';
import { error } from 'console';

// As shown in the document and the example project
// routes that require permission do not need to be configured on publicRoutes
// publicRoutes are used to configure routes that do not require permission
// But in actual use, if not configured publicRoutes, unable to enter the target page after login
// will stay on http://127.0.0.1:3000/sign-in?Redirect_url=http://127.0.0.1:3000/tasks
// And the server reported an error
// NFO: Clerk: The request to / is being redirected because there is no signed-in user, and the path is not included in `ignoredRoutes` or `publicRoutes`. To prevent this behavior, choose one of:

// 1. To make the route accessible to both signed in and signed out users, pass `publicRoutes: ["/"]` to authMiddleware
// 2. To prevent Clerk authentication from running at all, pass `ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/"]` to authMiddleware
// 3. Pass a custom `afterAuth` to authMiddleware, and replace Clerk's default behavior of redirecting unless a route is included in publicRoutes

// For additional information about middleware, please visit https://clerk.com/docs/nextjs/middleware

// Therefore, the current policy is to configure all pages in publicRoutes, and determine whether you are logged in on the page

export default authMiddleware({ publicRoutes: ['/', '/tasks'] });

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
