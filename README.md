# TaskFlow — Task Management System

A full-stack task tracker with JWT auth, filtering/search, pagination, and an analytics dashboard.

**Stack:** React (Vite) + Tailwind · Node.js + Express · MongoDB (Mongoose)

---

## Setup Steps

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod`, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend
```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI and a strong JWT_SECRET
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL should point at the backend, e.g. http://localhost:5000/api
npm install
npm run dev         # starts on http://localhost:5173
```

Open `http://localhost:5173`, sign up, and start creating tasks.

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Route      | Access  | Description                |
|--------|-----------|---------|----------------------------|
| POST   | `/signup` | Public  | Register a new user        |
| POST   | `/login`  | Public  | Log in, returns JWT        |
| GET    | `/me`     | Private | Get logged-in user profile |

### Tasks (`/api/tasks`) — all routes require `Authorization: Bearer <token>`
| Method | Route                     | Description                                              |
|--------|---------------------------|------------------------------------------------------------|
| GET    | `/`                       | List tasks. Query params: `status`, `priority`, `search`, `sortBy` (`dueDate`\|`priority`\|`createdAt`\|`title`), `order` (`asc`\|`desc`), `page`, `limit` |
| POST   | `/`                       | Create a task                                             |
| GET    | `/:id`                    | Get a single task                                          |
| PUT    | `/:id`                    | Update a task                                              |
| PATCH  | `/:id/complete`           | Shortcut to mark a task as `Done`                          |
| DELETE | `/:id`                    | Delete a task                                               |
| GET    | `/analytics/summary`      | Returns `{ total, completed, pending, completionPercentage }` |

---

## Design Decisions

- **JWT over sessions** — stateless auth keeps the API simple to scale/deploy, no server-side session store needed for a project this size.
- **Every task query is scoped by `user`** — no task can leak across accounts; this is enforced at the query level (`{ user: req.user._id }`), not just the UI.
- **Compound + text indexes on the `Task` model** (`{user,status}`, `{user,priority}`, `{user,dueDate}`, text index on `title`) — since every real query filters by user first, these keep filtering/sorting/search fast as data grows, instead of full collection scans.
- **Analytics via MongoDB aggregation** (`$group` by status) instead of pulling all tasks into Node and counting in memory — pushes the work to the database, which is what it's for.
- **Centralized error middleware** — every controller calls `next(err)` on failure; one place normalizes Mongoose validation/cast/duplicate-key errors into consistent JSON responses instead of scattering try/catch formatting everywhere.
- **Password hashing with bcrypt in a Mongoose pre-save hook**, `select: false` on the password field so it's never accidentally returned by a normal `find()`.
- **Route ordering matters**: `/tasks/analytics/summary` is registered before `/tasks/:id` so Express doesn't swallow it as an `:id` param — a common Express gotcha worth calling out.
- **Frontend**: React Context for auth state (small app, Redux would be overkill), an Axios interceptor attaches the JWT to every request and force-logs-out on a 401, and Tailwind's `dark:` variant + a `class`-based toggle handles dark mode without a second stylesheet.

## Product Enhancements Implemented
- Pagination (page/limit, server-side)
- Sorting by due date, priority, title, or created date, either direction
- Responsive layout (mobile-first grid)
- Dark mode with persisted preference

## Possible Extensions (noted, not built — see "if extended")
- Role-based access (e.g. shared/team tasks with owner vs. collaborator roles)
- Chart.js/Recharts visual for analytics instead of stat cards only

---

## Live Link
_Add your deployed URL here after deploying (see mentoring guide for quick Render/Vercel steps)._
