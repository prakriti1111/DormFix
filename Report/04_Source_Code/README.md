# Dormfix — Hostel Complaint & Maintenance Management System

A small-scale, production-structured MERN stack application for managing
hostel maintenance complaints, built as a Software Engineering and Project
Management (SEPM) academic project.

---

## 1. Project Overview

Dormfix lets hostel residents submit maintenance complaints (broken
fixtures, electrical issues, water supply problems, etc.) and lets a
warden track, prioritize, and resolve them. It focuses on doing a small
set of features correctly and securely rather than covering every
imaginable feature.

## 2. Problem Statement

Hostel maintenance issues are often reported verbally or over informal
chat groups, leading to lost requests, no accountability, and no way to
track how long an issue has been open. Residents have no visibility into
the status of what they reported, and wardens have no structured way to
prioritize or measure response times.

## 3. Objectives

- Give residents a simple way to report and track maintenance issues.
- Give the warden a single dashboard to view, filter, sort, and act on
  all complaints.
- Enforce accountability via status tracking, timestamps, and an
  automatically calculated overdue flag (48 hours).
- Allow the warden to manually prioritize complaints without an
  automated/AI-driven priority system.
- Collect resident feedback after resolution.

## 4. Features

- Resident registration & login, warden login (seeded, not publicly
  registerable).
- Complaint submission with optional image upload.
- Resident dashboard: stats + complaint history.
- Complaint details view for residents and warden.
- Feedback system (rating 1–5 + comment), allowed only after resolution.
- Warden dashboard: stats, resolved-per-day chart, average resolution time.
- Warden complaint list: filter (status, overdue, room), sort (newest,
  oldest, status, resolution date, overdue), and manual up/down reordering.
- Status workflow: SUBMITTED → UNDER_PROGRESS → RESOLVED (with a direct
  SUBMITTED → RESOLVED shortcut for already-fixed issues).
- Server-calculated overdue flag (isOverdue), never trusted from the client.
- Role-based authorization enforced on the backend for every protected route.

## 5. User Roles

| Role     | Capabilities |
|----------|--------------|
| Resident | Register, login, submit complaints, view own complaints, submit feedback after resolution |
| Warden   | Login, view all complaints, filter/sort/reorder, update status, view feedback, view dashboard stats |

## 6. Technology Stack

**Frontend:** React 18, Vite, React Router, Axios, plain CSS
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer

## 7. System Architecture

```
Browser (React SPA)
      │  REST (JSON / multipart)
      ▼
Express API (JWT auth + role middleware)
      │
      ▼
MongoDB (Mongoose models)
```

The backend follows a layered MVC-style architecture: routes →
controllers (HTTP concerns) → services (business logic) → models
(Mongoose schemas). Business logic is kept out of route files.

## 8. Folder Structure

```
Dormfix/
├── server/
│   ├── config/          # DB connection
│   ├── controllers/     # Request/response handling
│   ├── middleware/      # auth, role, upload, error handling
│   ├── models/          # Mongoose schemas (User, Complaint, Feedback, Counter)
│   ├── routes/          # Express routers
│   ├── services/        # Business logic
│   ├── utils/           # Helpers (JWT, responses, overdue calc, IDs)
│   ├── seed/             # Seed script
│   ├── tests/            # Example test files
│   ├── uploads/          # Uploaded complaint images (gitignored)
│   ├── server.js
│   └── package.json
└── client/
    ├── src/
    │   ├── api/          # Axios instance + per-resource API calls
    │   ├── components/   # Reusable UI components
    │   ├── context/       # AuthContext
    │   ├── hooks/         # useAuth
    │   ├── pages/          # Route-level pages
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## 9. Database Structure

**User**: fullName, email (unique), password (hashed), role
(resident/warden), registrationNumber (unique, resident only),
roomNumber.

**Complaint**: complaintId (HF-0001 style, unique), residentId,
residentName, registrationNumber, roomNumber, description, imagePath,
status, isOverdue, priorityOrder, resolvedAt, feedbackSubmitted,
createdAt, updatedAt.

**Feedback**: complaintId (unique — one feedback per complaint),
residentId, rating (1–5), comment.

**Counter**: internal helper collection used to atomically generate
sequential complaint IDs.

Indexes are added on `email`, `registrationNumber`, `residentId`,
`status`, `createdAt`, and `priorityOrder`.

## 10. API Overview

**Auth**
```
POST   /api/auth/register        Resident self-registration
POST   /api/auth/login            Login (resident or warden)
GET    /api/auth/me               Current authenticated user
```

**Complaints**
```
POST   /api/complaints                 Create complaint (resident, multipart)
GET    /api/complaints/my              Resident's own complaints
GET    /api/complaints/:id             Complaint details (own / any for warden)
GET    /api/complaints                 All complaints (warden, filter/sort query params)
PATCH  /api/complaints/:id/status      Update status (warden)
PATCH  /api/complaints/reorder         Manual reorder { complaintId, direction } (warden)
```

**Feedback**
```
POST   /api/complaints/:id/feedback    Submit feedback (resident, resolved only)
GET    /api/complaints/:id/feedback    View feedback (own / any for warden)
```

**Dashboard**
```
GET    /api/dashboard/warden           Aggregated warden statistics
```

## 11. Authentication Approach

- Passwords hashed with bcryptjs (10 salt rounds) — never stored or
  returned in plaintext.
- JWT issued on login/registration, sent as `Authorization: Bearer <token>`.
- `protect` middleware verifies the token and loads the user.
- `authorize(...roles)` middleware restricts routes by role.
- Resident identity fields (name, registration number, room number) are
  read from the authenticated user's profile server-side when creating a
  complaint — never trusted from the request body.
- Ownership is checked server-side on every complaint/feedback read —
  a resident cannot view or act on another resident's data by guessing IDs.

## 12. Installation Steps

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### Clone / unzip the project, then:

```bash
cd Dormfix
```

## 13. Environment Variables

**server/.env** (copy from `server/.env.example`):
```
MONGO_URI=mongodb://127.0.0.1:27017/dormfix
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=5
CLIENT_ORIGIN=http://localhost:5173
SEED_WARDEN_PASSWORD=Warden@123
SEED_RESIDENT_PASSWORD=Resident@123
```

**client/.env** (copy from `client/.env.example`):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 14. Running the Backend

```bash
cd server
npm install
cp .env.example .env      # then edit values as needed
npm run seed               # creates demo warden, residents, and sample complaints
npm run dev                 # starts on http://localhost:5000
```

## 15. Running the Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev                 # starts on http://localhost:5173
```

## 16. Seed Database Instructions

`npm run seed` (inside `server/`) drops existing data and creates:
- 1 demo warden account
- 4 demo resident accounts
- 5 sample complaints across SUBMITTED / UNDER_PROGRESS / RESOLVED,
  including one overdue example and resolved feedback

**Demo credentials (development only):**
| Role     | Email                     | Password (default, see .env) |
|----------|---------------------------|-------------------------------|
| Warden   | warden@dormfix.edu      | Warden@123                    |
| Resident | aarav@dormfix.edu       | Resident@123                  |

Warden accounts are intentionally **not** creatable through public
registration — the seed script is the documented, controlled way to
create the initial warden account.

## 17. Testing Instructions

Example test files are provided under `server/tests/` using Jest and
Supertest, demonstrating the required test-ready structure (auth,
authorization, overdue logic, feedback rules). To run them fully, wire
up a test database (e.g. `mongodb-memory-server`) and run:

```bash
cd server
npm test
```

## 18. Current Scope

Everything listed in Section 4 (Features) above is implemented and
functional end-to-end.

## 19. Limitations

- No real-time updates (no WebSockets) — the frontend polls/refetches
  on navigation and action.
- No email/SMS/push notifications.
- Manual reordering is a simple swap-based mechanism, not a full
  drag-and-drop UI.
- Single warden role is assumed (no multi-warden assignment).

## 20. Future Scope

- Technician accounts and assignment workflow (explicitly out of scope
  for this version; today the warden contacts maintenance personnel
  externally after reviewing a complaint).
- Email/SMS notifications on status changes.
- Real-time updates via WebSockets.
- Cloud image storage (Cloudinary) — the upload layer is already
  structured to make this swap straightforward.
- Mobile application.
- Analytics dashboard beyond basic counts and average resolution time.
