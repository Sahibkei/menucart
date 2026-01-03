# Menu Cart

This project is a Next.js (App Router) application that powers Menu Cart&apos;s restaurant directory and business dashboard. It includes authentication for business accounts, MongoDB persistence via Mongoose, and an API that drives the homepage directory listings.

## Environment variables
Create a `.env.local` file with the required secrets before running the app locally or deploying to Vercel:

```
MONGODB_URI=
JWT_SECRET= # use a long random secret for signing cookies
NODE_ENV=development
```

`MONGODB_URI` should point to your MongoDB Atlas connection string. `JWT_SECRET` is used to sign the `mc_session` httpOnly cookie. Make sure these variables are also configured for Vercel preview and production deployments.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Business authentication (register, login, logout, session check) backed by signed JWT cookies.
- MongoDB persistence using Mongoose with a cached connection for serverless compatibility.
- Directory API and seeded demo businesses for local development.
- Protected dashboard routes via middleware.

## Manual acceptance checks

- `npm run dev` with `MONGODB_URI` + `JWT_SECRET` set.
- Register a business via Sign Up (Business tab) → redirected to dashboard.
- Refresh dashboard route → stays logged in.
- Logout → redirected to login (or cannot access dashboard anymore).
- Home page shows featured restaurants fetched from API (seeded in dev).
