# GigFlow

A production-quality Lead Management System (CRM) built for efficiency and scale.

## Features

- **Robust Authentication:** JWT-based secure access with session persistence.
- **Role-Based Access Control (RBAC):** Distinct permissions for `admin` and `sales` roles.
- **Advanced Lead Management:** Full CRUD operations with a polished, responsive dashboard.
- **Smart Filtering:** Combined filtering by status, source, and real-time debounced search.
- **CSV Export:** Export filtered lead data for offline analysis.
- **Dark Mode:** System-aware toggle with persistent user preference.
- **Developer Experience:** TypeScript throughout, absolute imports, and containerized development.

## Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Routing:** React Router 7
- **Forms:** React Hook Form & Zod
- **Icons:** Lucide React
- **Notifications:** Sonner

### Backend
- **Runtime:** Node.js (Express)
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Security:** JWT, bcryptjs, Helmet, CORS
- **Validation:** Zod

## Project Structure

```text
gigflow/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI & Feature components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── layouts/     # Page layout wrappers
│   │   ├── pages/       # Route-level components
│   │   ├── services/    # API interaction layer
│   │   ├── store/       # Zustand state stores
│   │   └── utils/       # Shared utility functions
├── server/              # Express Backend
│   ├── src/
│   │   ├── config/      # DB & Env configurations
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API route definitions
│   │   ├── services/    # Business logic layer
│   │   └── utils/       # Backend helpers
└── docker-compose.yml   # Orchestration for the full stack
```

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (Local or Atlas)
- Docker (Optional, for containerized setup)

### Quick Start (Manual)

1. **Clone & Install**
   ```bash
   git clone https://github.com/kushwith03/gigflow.git
   cd gigflow
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create .env from .env.example
   npm run seed  # Populate initial admin/sales users & leads
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   # Create .env from .env.example
   npm run dev
   ```

### Quick Start (Docker)
```bash
docker-compose up --build
```
Access the app at `http://localhost`.

## API Documentation

Detailed API documentation is available in [API.md](./API.md).

### Auth Endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate and get token
- `GET /api/auth/me` - Get current user profile (Protected)

### Leads Endpoints
- `GET /api/leads` - List leads (Filters: `status`, `source`, `search`, `page`, `sort`)
- `POST /api/leads` - Create new lead (Protected)
- `GET /api/leads/:id` - Get lead details (Protected)
- `PATCH /api/leads/:id` - Update lead (Protected)
- `DELETE /api/leads/:id` - Remove lead (Admin Only)

## Default Credentials (after seeding)
- **Admin:** `admin@gigflow.com` / `password123`
- **Sales:** `sales@gigflow.com` / `password123`

---
Built for production-company internship preparations.
