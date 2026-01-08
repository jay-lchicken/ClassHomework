This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Authentication Setup

This project uses [Auth0](https://auth0.com) for authentication. Before running the application, you need to set up Auth0:

### 1. Create an Auth0 Account and Application

1. Sign up for a free account at [Auth0](https://auth0.com)
2. Create a new application:
   - Go to Applications → Create Application
   - Choose "Regular Web Applications"
   - Note down your Domain, Client ID, and Client Secret

### 2. Configure Auth0 Application

In your Auth0 application settings:

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback
https://your-production-domain.com/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
https://your-production-domain.com
```

### 3. Set Environment Variables

Create a `.env.local` file in the root directory:

```bash
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN'
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'

# Database
NEXT_PUBLIC_URL='http://localhost:3000'
```

**Note:** For production, update `AUTH0_BASE_URL` and `NEXT_PUBLIC_URL` to your production domain.

### 4. Email Domain Restrictions

This application restricts access to users with email addresses ending in:
- `@s2024.ssts.edu.sg`
- `@sst.edu.sg`

Users with other email domains will receive an authorization error. To modify this, edit the validation logic in `src/app/api/addHomework/route.js`.

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
