# 📚 Personal Book Manager

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

A production-quality personal book management application with a **JIRA-inspired dashboard aesthetic**. Track your reading journey with features like time-aware greetings, auto-generated cover colors, reading streaks, and full CRUD operations.


---

## ✨ Features

- **JWT Authentication** — Secure httpOnly cookie-based auth (no localStorage)
- **Dashboard** — Stats, reading streak, time-aware personalized greeting
- **Full CRUD** — Add, edit, delete, and filter books
- **Smart Filtering** — By status, tags, and search
- **Keyboard Shortcuts** — Press `N` to quickly add a book
- **Auto Cover Colors** — Deterministic pastel colors generated from book titles
- **Optimistic UI** — Instant feedback on status changes
- **Swagger API Docs** — Full OpenAPI 3.0 documentation at `/api-docs`
- **Zod Validation** — Shared schemas between frontend forms and API routes

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Next.js 14 (App Router, TypeScript) |
| Styling    | Tailwind CSS                        |
| Backend    | Next.js API Routes                  |
| Database   | MongoDB via Mongoose                |
| Auth       | JWT (jose) + httpOnly cookies       |
| Validation | Zod + react-hook-form               |
| API Docs   | swagger-jsdoc + swagger-ui-react    |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd pbm

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable              | Description                               |
| --------------------- | ----------------------------------------- |
| `MONGODB_URI`         | MongoDB connection string                 |
| `JWT_SECRET`          | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN`      | Token expiry duration (e.g., `7d`)        |
| `NEXT_PUBLIC_APP_URL` | Application URL                           |
| `NODE_ENV`            | `development` or `production`             |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (dashboard)/         # Protected pages (dashboard, books)
│   ├── api/                 # API routes (auth, books, docs)
│   └── api-docs/            # Swagger UI page
├── components/
│   ├── ui/                  # Reusable primitives (Button, Input, Badge, Modal)
│   ├── books/               # BookCard, BookForm, BookFilters, BookGrid
│   ├── layout/              # Sidebar, Navbar, GreetingBanner
│   └── shared/              # LoadingSpinner, EmptyState, ConfirmDialog
├── lib/                     # DB, JWT, auth, swagger, middleware, API helpers
├── models/                  # Mongoose schemas (User, Book)
├── schemas/                 # Zod validation schemas
├── hooks/                   # Custom React hooks (useBooks, useAuth)
├── types/                   # TypeScript interfaces
└── middleware.ts            # Route protection
```

---

## 📖 API Documentation

Interactive API docs are available at `/api-docs` when the dev server is running.

**Endpoints:**

| Method | Endpoint             | Description            | Auth |
| ------ | -------------------- | ---------------------- | ---- |
| POST   | `/api/auth/register` | Register new user      | No   |
| POST   | `/api/auth/login`    | Login (sets cookie)    | No   |
| POST   | `/api/auth/logout`   | Logout (clears cookie) | No   |
| GET    | `/api/auth/me`       | Get current user       | Yes  |
| GET    | `/api/books`         | List all books         | Yes  |
| POST   | `/api/books`         | Create a book          | Yes  |
| GET    | `/api/books/:id`     | Get single book        | Yes  |
| PUT    | `/api/books/:id`     | Update a book          | Yes  |
| DELETE | `/api/books/:id`     | Delete a book          | Yes  |

---

## 🎨 Design Decisions

### Why httpOnly Cookies over localStorage?

JWT stored in httpOnly cookies is not accessible via JavaScript, making it immune to XSS attacks. Combined with `sameSite: strict` and `secure` flags in production, this is the gold standard for web auth.

### Why Zod for Validation?

Zod schemas are shared between frontend (react-hook-form + zodResolver) and backend (API route validation), ensuring a single source of truth for validation rules.

### Why `withAuth(withValidation(schema, handler))` HOF Pattern?

This Higher-Order Function composition eliminates repetitive auth checks and validation boilerplate across every route, keeping route handlers focused on business logic. This is the kind of DRY pattern that signals senior-level thinking.

### Why `jose` over `jsonwebtoken`?

`jose` works in Edge runtime (Next.js middleware), while `jsonwebtoken` requires Node.js. This allows JWT verification in middleware.ts for route protection.

### Why Deterministic Cover Colors?

Each book gets a pastel color based on a hash of its title, providing visual identity without requiring actual cover images. The same title always produces the same color.

---

## 🚢 Deployment

### Vercel + MongoDB Atlas

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy — Vercel auto-detects Next.js

**MongoDB Atlas:**

- Create a free cluster at [mongodb.com](https://www.mongodb.com/atlas)
- Whitelist `0.0.0.0/0` for Vercel's dynamic IPs
- Copy connection string to `MONGODB_URI`

---

## 📝 License

MIT
