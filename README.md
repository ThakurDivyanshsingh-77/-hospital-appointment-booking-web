# CareConnect Suite (MERN)

This project now uses a MERN architecture:

- Frontend: Next.js + React + TypeScript
- Backend: Node.js + Express + MongoDB + JWT auth
- Database: MongoDB
- File uploads: local disk storage via Multer (`backend/uploads`)

## Project Structure

- `src/` frontend app
- `backend/` Express API server

## Backend Setup

1. Go to backend:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create env file:

```bash
cp .env.example .env
```

4. Update `backend/.env`:

- `MONGO_URI` (your MongoDB connection string)
- `JWT_SECRET` (any secure secret)
- `CLIENT_URL` (frontend URL, default local Next origins: `http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173`)
- optional seeded admin credentials:
  - `SEED_ADMIN_EMAIL`
  - `SEED_ADMIN_PASSWORD`
  - `SEED_ADMIN_NAME`

5. Run backend:

```bash
npm run dev
```

## Frontend Setup

1. From project root, install dependencies:

```bash
npm install
```

2. Ensure root `.env` includes:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

3. Run frontend:

```bash
npm run dev
```

The Next.js dev server is configured for `http://localhost:8080`.

## Useful Commands

From root:

- `npm run dev` -> frontend
- `npm run dev:backend` -> backend
- `npm run build` -> frontend production build

From `backend/`:

- `npm run dev` -> backend with nodemon
- `npm run seed` -> seed default departments and optional admin

## Auth + Roles

- Signup from UI creates a `patient` account.
- Admin can create doctor accounts from Admin -> Doctors.
- Protected pages are role-based (`admin`, `doctor`, `patient`).
