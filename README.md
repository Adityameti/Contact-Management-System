
# Contact Management System (Full-Stack)

A simple full‑stack Contact Management System.

- **Features**: Add, view, edit, delete, and search contacts (by name, email, company, or tags)
- **UI**: Responsive layout with basic validation
- **Backend**: Node.js + Express, JSON file persistence (no external DB required beacuse the sample seed is very less, however, for production-level, it can be upgraded to mysql or mongodb)
- **Frontend**: React (Vite)

## Tech Stack
- Frontend: React 18, Vite
- Backend: Node.js 18, Express 4, CORS
- Database: JSON file (`backend/db.json`) (seeded with 12 sample contacts)



## Running locally (Must be with 2 terminals only)
### 1) Backend

cd backend
npm install
npm start

API → http://localhost:4000

### 2) Frontend

cd frontend
npm install
npm run dev

Web → http://localhost:5173

> On first backend run, the server seeds **12 sample contacts**.

## REST API Summary
- `GET /api/contacts?q=term` — list/search contacts (name, email, company, tags)
- `GET /api/contacts/:id` — retrieve contact
- `POST /api/contacts` — create
- `PUT /api/contacts/:id` — update
- `DELETE /api/contacts/:id` — delete

### Contact Fields
- **Required**: `name`, `email` (validated), `phone`
- **Optional**: `company`, `tags` (string[]), `notes`

