# GigFlow API Documentation 📖

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

### Register User
`POST /auth/register`
- **Body:** `{ "name": "...", "email": "...", "password": "...", "role": "admin" | "sales" }`
- **Response:** `201 Created` with user data and JWT token.

### Login
`POST /auth/login`
- **Body:** `{ "email": "...", "password": "..." }`
- **Response:** `200 OK` with user data and JWT token.

### Get Profile
`GET /auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with current user data.

## 👥 Leads Management

### List Leads
`GET /leads`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `status`: Filter by lead status
  - `source`: Filter by lead source
  - `search`: Search by name or email
  - `page`: Page number (default 1)
  - `limit`: Items per page (default 10)
  - `sort`: `latest` | `oldest`
- **Response:** `200 OK` with array of leads and pagination metadata.

### Create Lead
`POST /leads`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "name": "...", "email": "...", "source": "...", "status": "..." }`
- **Response:** `201 Created` with created lead data.

### Update Lead
`PATCH /leads/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Partial lead object.
- **Response:** `200 OK` with updated lead data.

### Delete Lead
`DELETE /leads/:id`
- **Headers:** `Authorization: Bearer <token>` (Admin Only)
- **Response:** `200 OK` with success message.

## 🏥 Health Check
`GET /health`
- **Response:** `200 OK` with server status and environment info.
