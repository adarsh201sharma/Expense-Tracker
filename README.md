# 💰 Expense Tracker

A full-stack personal finance application that helps users track expenses, visualise spending patterns, and gain insights through interactive dashboards.

**Live Demo:** [https://expense-tracker-adarsh.vercel.app](https://expense-tracker-adarsh.vercel.app) *(replace with your actual URL after deployment)*

![Dashboard Preview](./public/screenshot.png)

---

## ✨ Features

- 🔐 **Secure Authentication** — Email/password auth with NextAuth.js, bcrypt password hashing, and JWT sessions
- 📊 **Interactive Dashboards** — Real-time charts using Recharts showing category-wise breakdown and 6-month spending trends
- 💸 **Full CRUD Operations** — Add, edit, delete, and filter expenses across 10 categories
- 🔍 **Dynamic Filtering & Sorting** — Filter by category, sort by date or amount (ascending/descending)
- 📈 **Smart Statistics** — Total spent, monthly spending, transaction count, and average per expense
- 🎨 **Responsive Design** — Fully responsive UI with Tailwind CSS, works seamlessly across devices
- ⚡ **Performance Optimised** — MongoDB compound indexes, server-side aggregation pipelines, paginated queries

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18 with Server Components
- Tailwind CSS for styling
- Recharts for data visualisation
- Lucide React icons
- React Hot Toast for notifications

**Backend**
- Next.js API Routes (App Router)
- NextAuth.js for authentication
- MongoDB with Mongoose ODM
- bcryptjs for password hashing

**Deployment**
- Vercel (frontend + serverless functions)
- MongoDB Atlas (database)

---

## 🏗️ Architecture Highlights

### Database Design
- **Compound indexes** on `{ user, date }` and `{ user, category }` for fast filtered queries
- **MongoDB aggregation pipelines** for stats — category groupings and 6-month rolling totals computed server-side
- **User-scoped queries** enforced at the API layer for data isolation

### Authentication Flow
- JWT-based sessions via NextAuth.js
- Password hashed with bcrypt (10 rounds)
- Server-side session validation on every protected API route

### Performance
- Pagination on expense queries (default 100, max 500)
- Server-side aggregation reduces client-side computation to zero
- Lean MongoDB queries (`.lean()`) for read-only operations

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/adarsh201sharma/Expense-Tracker.git
cd Expense-Tracker

# 2. Install dependencies
npm install

# 3. Create .env.local from the example
cp .env.local.example .env.local
# Then edit .env.local with your MongoDB URI and a NextAuth secret

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up to create an account.

### Environment Variables

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expense_tracker
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

---

## 📂 Project Structure

```
expense-tracker/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   ├── register/              # User registration
│   │   ├── expenses/              # CRUD endpoints
│   │   │   └── [id]/              # Single expense ops
│   │   └── stats/                 # Aggregation pipeline
│   ├── dashboard/                 # Main app screen
│   ├── login/                     # Auth pages
│   └── signup/
├── components/
│   ├── Navbar.js
│   ├── ExpenseForm.js
│   ├── ExpenseList.js
│   └── Charts.js
├── lib/
│   ├── mongodb.js                 # DB connection w/ global cache
│   ├── auth.js                    # NextAuth config
│   └── categories.js
├── models/
│   ├── User.js
│   └── Expense.js                 # Schema w/ compound indexes
└── README.md
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/auth/[...nextauth]` | NextAuth signin |
| `GET`  | `/api/expenses` | List user's expenses (supports `?category`, `?sortBy`, `?order`, `?page`, `?limit`) |
| `POST` | `/api/expenses` | Create a new expense |
| `PATCH`| `/api/expenses/:id` | Update an expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense |
| `GET`  | `/api/stats` | Aggregated stats (total, monthly, by category) |

---

## 🚢 Deployment

This app deploys cleanly to Vercel:

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
4. Deploy — Vercel auto-detects Next.js and configures everything

For `NEXTAUTH_URL`, use your deployed Vercel URL (e.g. `https://expense-tracker-adarsh.vercel.app`).

---

## 🗺️ Roadmap

- [ ] Budget limits per category with alerts
- [ ] CSV import/export
- [ ] Recurring expense templates
- [ ] Multi-currency support
- [ ] AI-powered spending insights (Anthropic Claude integration)
- [ ] Receipt OCR via image upload

---

## 📄 License

MIT — feel free to use, modify, and ship.

---

**Built by [Adarsh Sharma](https://github.com/adarsh201sharma)** • [LinkedIn](https://www.linkedin.com/in/adarsh201sharma/)
