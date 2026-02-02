
# Backend (Express API)

A minimal Express.js REST API.

## Endpoints
- `GET /api/contacts?q=term` — list/search contacts (searches name, email, company, and tags)
- `GET /api/contacts/:id` — get a single contact
- `POST /api/contacts` — create a contact
- `PUT /api/contacts/:id` — update a contact
- `DELETE /api/contacts/:id` — delete a contact

### Contact schema

{
  "id": "uuid",
  "name": "string",         
  "email": "string",        
  "phone": "string",       
  "company": "string",     
  "tags": ["string"],        
  "notes": "string"        
}


## Run locally
Prerequisites: **Node.js 18+**

IN BASH:
cd backend
npm install
npm start


This API will start at `http://localhost:4000`. On the first run, it seeds **12 sample contacts**.
