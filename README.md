# 🏥 CareConnect Suite

A full-stack **Healthcare Management System** built on the MERN-style architecture — connecting patients, doctors, and admins on a single secure platform.

![Status](https://img.shields.io/badge/status-active-success)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Express%20%7C%20MongoDB-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📖 Overview

CareConnect Suite streamlines appointment booking, doctor management, and patient records through a role-based access system. Patients can register and book appointments, doctors manage their schedules and patients, and admins oversee the entire system from a dedicated dashboard.

---

## ✨ Features

- 🔐 **JWT-based Authentication** — secure signup/login with role management
- 👥 **Role-Based Access Control** — separate flows for `admin`, `doctor`, and `patient`
- 🩺 **Doctor Management** — admins can onboard doctors directly from the dashboard
- 📅 **Appointment System** — patients can book, view, and manage appointments
- 📂 **File Uploads** — local disk storage via Multer (reports, profile pictures, etc.)
- 🏢 **Department Seeding** — pre-configured hospital departments via seed script
- ⚡ **Modern Frontend** — built with Next.js, React & TypeScript for speed and type safety
- 🌐 **RESTful API** — clean Express-based backend architecture

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT (JSON Web Tokens) |
| File Storage | Multer (local disk) |
| Dev Tools | Nodemon, dotenv |

---

## 📁 Project Structure

```
careconnect-suite/
├── src/                  # Frontend application (Next.js + React + TS)
├── backend/              # Express API server
│   ├── uploads/          # Multer file storage
│   ├── .env.example      # Backend environment template
│   └── ...
├── .env                  # Frontend environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas URI)
- npm

### 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with the following:

| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Any secure random secret string |
| `CLIENT_URL` | Allowed frontend origins (default: `http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173`) |
| `SEED_ADMIN_EMAIL` | *(optional)* Default admin email |
| `SEED_ADMIN_PASSWORD` | *(optional)* Default admin password |
| `SEED_ADMIN_NAME` | *(optional)* Default admin name |

Run the backend:

```bash
npm run dev
```

### 2️⃣ Frontend Setup

From the project root:

```bash
npm install
```

Ensure your root `.env` contains:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Run the frontend:

```bash
npm run dev
```

The Next.js dev server runs by default on **`http://localhost:8080`**.

---

## 🧰 Useful Commands

**From project root:**

| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server |
| `npm run dev:backend` | Start backend dev server |
| `npm run build` | Create frontend production build |

**From `backend/`:**

| Command | Description |
|---|---|
| `npm run dev` | Start backend with nodemon (auto-restart) |
| `npm run seed` | Seed default departments + optional admin account |

---

## 🔑 Auth & Roles

- **Patient** — Self-signup available from the UI; can book & manage appointments.
- **Doctor** — Account created only by an Admin via `Admin → Doctors`.
- **Admin** — Full system access; manages doctors, departments, and appointments.
- All protected routes/pages are guarded based on role (`admin`, `doctor`, `patient`).

---

## 🗺️ Roadmap (Suggested Next Steps)

- [ ] Email/SMS appointment reminders
- [ ] Doctor availability calendar UI
- [ ] Patient medical history timeline
- [ ] Cloud file storage (S3/Cloudinary) instead of local disk
- [ ] Dockerize backend + frontend for easier deployment

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋 Support

For issues or contributions, please open an issue in the repository or reach out to the maintainer directly.
