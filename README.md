# gigflow

A production-quality Lead Management System built with the MERN stack.

## Features

- **JWT Authentication:** Secure access with role-based permissions (Admin/Sales).
- **Leads Management:** Full CRUD operations for sales leads.
- **Advanced Filtering:** Search, debounced filtering, and pagination.
- **CSV Export:** Export lead data for external reporting.
- **Responsive Dashboard:** Optimized for both desktop and mobile.
- **Docker Ready:** Easy deployment with containerization.

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- TailwindCSS
- Zustand (State Management)
- React Router (Routing)
- Axios (API Client)
- React Hook Form & Zod (Forms & Validation)

### Backend
- Node.js & Express
- TypeScript
- MongoDB & Mongoose (ODM)
- JWT & bcryptjs (Security)

## Project Structure

```text
gigflow/
├── client/          # React frontend
├── server/          # Express backend
└── README.md        # Project documentation
```

## Setup Instructions

### Backend
1. `cd server`
2. `npm install`
3. Create `.env` from `.env.example`
4. `npm run dev`

### Frontend
1. `cd client`
2. `npm install`
3. Create `.env` from `.env.example`
4. `npm run dev`
