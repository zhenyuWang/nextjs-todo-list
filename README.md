# nextjs todo list

 This is a react todo list application built with [Next.js](https://nextjs.org/), including to-do creation, classify, editing, deleting and other functions.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notice:
- If the expected page cannot be redirected after vercel is deployed, you need to configure NEXTAUTH_URL, it wasn't needed before.
- Dynamic file creation is not supported on vercel, so the logic is not valid after deployment\
  If you want to update your avatar, you need to upload it to the GitHub repository based on the user.id, file address is `public/avatar/${user.id}-avatar.png`\
  If there are other users, I would consider storing the avatars in the database in base64 format.


## TODO:

- [x] optimize code, such as send email、action catch、type
- [x] optimize UI