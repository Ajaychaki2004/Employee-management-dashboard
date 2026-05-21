# Employee Management Dashboard

Full‑stack employee management app.

- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Frontend:** React + Vite + Tailwind

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB (local MongoDB or MongoDB Atlas connection string)

## 1) Backend setup (API)

From the project root:

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/employee_management
```

Start the backend:

```bash
npm run dev
```

The API runs on:

- `http://localhost:5000`
- Routes are under `http://localhost:5000/api` (e.g. `/api/auth/login`, `/api/employees`)

## 2) Frontend setup (UI)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will print the dev URL (typically `http://localhost:5173`).

## Notes

- The frontend calls the backend at `http://localhost:5000/api` (see `frontend/src/api/axios.js`).
- Auth token is stored in `localStorage` and sent as `Authorization: Bearer <token>`.

## Common commands

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

Backend:

```bash
cd backend
npm run dev
```
