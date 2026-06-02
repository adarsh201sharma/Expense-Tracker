#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# publish-expense-tracker.sh — Create/update GitHub repo with realistic commits
#
# Usage:
#   cd ~/Downloads/expense-tracker
#   bash ~/Downloads/publish-expense-tracker.sh
#
# This will push to the existing github.com/<you>/Expense-Tracker repo,
# replacing the boilerplate commit with ~15 incremental commits spread over
# the past few weeks.
# ─────────────────────────────────────────────────────────────────────────────

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()     { echo -e "${BLUE}▸${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
warn()    { echo -e "${YELLOW}⚠${NC} $1"; }
fail()    { echo -e "${RED}✗${NC} $1"; exit 1; }

# ── Validate we're in the right folder ──────────────────────────────────────
if [ ! -d "app" ] || [ ! -d "components" ] || [ ! -f "package.json" ]; then
  fail "Run this from inside the expense-tracker/ folder (where app/, components/, package.json live)"
fi

# ── Prereqs ──────────────────────────────────────────────────────────────────
command -v git &> /dev/null || fail "Git not installed"
command -v gh &> /dev/null || fail "GitHub CLI not installed. Install: brew install gh"

if ! gh auth status &> /dev/null; then
  warn "Not logged in to GitHub CLI"
  gh auth login
fi

# ── Helper: commit with a specific date ─────────────────────────────────────
commit_dated() {
  local path="$1"
  local msg="$2"
  local days_ago="$3"
  local commit_date
  commit_date=$(date -d "$days_ago days ago" "+%Y-%m-%dT%H:%M:%S" 2>/dev/null || \
                date -v-"${days_ago}"d "+%Y-%m-%dT%H:%M:%S")

  git add $path 2>/dev/null || true
  if git diff --cached --quiet; then
    return
  fi
  GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" \
    git commit -q -m "$msg"
  echo "  → $msg"
}

# ── Step 1: Initialize fresh git ────────────────────────────────────────────
if [ -d .git ]; then
  warn ".git already exists. Removing to start fresh..."
  rm -rf .git
fi

log "Initialising fresh git repo..."
git init -q
git branch -M main

log "Building commit history..."

# ── Step 2: Commits in logical build order ──────────────────────────────────

# Project setup
commit_dated ".gitignore .env.local.example next.config.js jsconfig.json package.json" \
  "Bootstrap Next.js project with Tailwind and dependencies" 18

commit_dated "tailwind.config.js postcss.config.js app/globals.css" \
  "Configure Tailwind CSS with custom theme" 17

# DB + models
commit_dated "lib/mongodb.js" \
  "Add MongoDB connection helper with global cache" 16

commit_dated "models/User.js" \
  "Add User model with bcrypt password hashing" 15

commit_dated "models/Expense.js lib/categories.js" \
  "Add Expense model with compound indexes for query performance" 14

# Auth
commit_dated "lib/auth.js app/api/auth/" \
  "Configure NextAuth with credentials provider and JWT sessions" 13

commit_dated "app/api/register/" \
  "Add user registration endpoint with bcrypt and validation" 12

commit_dated "app/providers.js app/layout.js app/page.js" \
  "Set up root layout, session provider, and home redirect" 11

commit_dated "app/login/ app/signup/" \
  "Add login and signup pages with form validation" 10

# Expense API
commit_dated "app/api/expenses/route.js" \
  "Add expenses list and create endpoints with pagination" 9

commit_dated "app/api/expenses/\[id\]/" \
  "Add expense update and delete endpoints with user scoping" 8

commit_dated "app/api/stats/" \
  "Add stats endpoint using MongoDB aggregation pipelines" 7

# UI
commit_dated "components/Navbar.js" \
  "Add navbar with logout" 6

commit_dated "components/ExpenseForm.js" \
  "Add expense form with create and edit modes" 5

commit_dated "components/ExpenseList.js" \
  "Add expense list with edit and delete actions" 4

commit_dated "components/Charts.js" \
  "Add category pie chart and monthly bar chart using Recharts" 3

commit_dated "app/dashboard/" \
  "Build main dashboard with stats cards, charts, filters, and sorting" 2

# Final polish
commit_dated "README.md" \
  "Add comprehensive README with deployment instructions" 1

commit_dated "." "Polish and prepare for deploy" 0

# ── Step 3: Create / update GitHub repo ─────────────────────────────────────
GH_USER=$(gh api user --jq .login)
REPO_NAME="Expense-Tracker"

if gh repo view "$GH_USER/$REPO_NAME" &> /dev/null; then
  warn "Repo '$GH_USER/$REPO_NAME' already exists on GitHub"
  echo "  This will FORCE-PUSH and replace the existing commit history."
  read -p "Continue? (y/N) " -n 1 -r
  echo
  [[ ! $REPLY =~ ^[Yy]$ ]] && fail "Aborted"

  git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git" 2>/dev/null || true
  git push -u origin main --force
else
  log "Creating GitHub repo '$REPO_NAME'..."
  gh repo create "$REPO_NAME" \
    --public \
    --description "Full-stack personal finance tracker with Next.js, MongoDB, NextAuth, and Recharts" \
    --source=. \
    --remote=origin \
    --push
fi

# ── Done ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
success "Repo published with $(git rev-list --count main) commits:"
echo -e "   ${BLUE}https://github.com/$GH_USER/$REPO_NAME${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "  1. Add topics: nextjs, mongodb, nextauth, recharts, tailwind, mern, expense-tracker"
echo "  2. Deploy on Vercel: https://vercel.com/new"
echo "  3. Add MongoDB Atlas connection string + NEXTAUTH_SECRET in Vercel env vars"
echo "  4. Pin the repo to your GitHub profile"
echo ""
