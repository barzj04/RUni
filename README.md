# RUni 🍳

A shared household management app for roommates, built with React + Supabase.

## Features

- **Groceries** — shared grocery list with 50/50 bill splitting and paid back tracking
- **Grocery Wishlist** — shared list of ingredients to buy someday, moveable to the bill
- **Personal Tab** — private wishlist and to-do list, protected with Row Level Security

## Tech Stack

- React (Vite)
- Supabase (Auth, Database, Row Level Security)
- Vitest (Unit Testing)

## Security

- Input sanitization to prevent XSS attacks
- Row Level Security on personal data — only the owner can read/write their own data
- Environment variables for all secrets — never committed to GitHub
- Supabase Auth for session management

## Software Engineering Practices

- Feature branch workflow — all features developed on separate branches, merged into dev, then main
- Semantic commit messages — e.g. `feat:`, `fix:`, `security:`, `test:`
- Separation of concerns — services, pages, components, and utils in separate folders
- Unit tested bill splitting logic
- Loading states on all data fetching

## Project Structure
src/
├── components/    # reusable UI pieces (Navbar, Spinner)
├── pages/         # full page views (Groceries, Personal, etc.)
├── services/      # all Supabase calls
├── hooks/         # custom React hooks
└── utils/         # helper functions (sanitize, billSplitting)

## Local Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with your Supabase credentials:
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
4. Run `npm run dev`

## Running Tests
npm test