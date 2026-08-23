# Authentication & Order Isolation Implementation Tasks

- `[x]` Update database `User` model to support extra frontend fields (`src/models/User.ts`)
- `[x]` Add verifyToken and update register logic (`src/lib/auth.ts`)
- `[x]` Update register route to handle name input (`src/app/api/auth/register/route.ts`)
- `[x]` Create `/api/auth/me` endpoint for session fetching & address updates (`src/app/api/auth/me/route.ts`)
- `[x]` Rewrite frontend `AuthContext` to make API calls to database backend (`src/context/AuthContext.tsx`)
- `[x]` Update Account page to load user orders dynamically from backend API (`src/app/account/page.tsx`)
- `[x]` Update Checkout success page to sync orders to MongoDB Atlas (`src/app/checkout/page.tsx`)
- `[x]` Create order tracking backend API route (`src/app/api/orders/track/route.ts`)
- `[x]` Update Order Tracking frontend page to query Atlas database (`src/app/order-tracking/page.tsx`)
- `[x]` Implement file-based DB fallback for local environment testing when `MONGODB_URI` is placeholder (`src/lib/mongodb.ts`)
- `[x]` Restart Next.js dev server and verify compilation success
