# 🍳 RUni (Roomie-Universe)

> Because loving your roommates is easy. Keeping track of the shared grocery list? That's the real test.

**RUni** is a friendly household management app designed to keep everyone on the same page, take the guesswork out of splitting bills, and make sure the fridge is always stocked with the essentials everyone loves.

---

## ✨ Features

### 🛒 Groceries (The Battleground)
*   **50/50 Bill Splitting:** Add items, split the costs automatically, and track who owes what.
*   **Paid Back Tracking:** Mark debts as settled with a single click. No more passive-aggressive post-it notes on the fridge.

### 💡 Grocery Wishlist (The "Someday" List)
*   A shared repository for dreams, cravings, and ingredients you might buy *eventually*. 
*   Ready to buy? Move items instantly from the wishlist straight to the active bill.

### 🔒 Personal Tab (Your Private Sanctuary)
*   A completely private wishlist and to-do list just for you. 

---

## 🛠️ The Tech Stack

*   **Frontend:** React (powered by Vite, because life is too short for slow bundlers)
*   **Backend-as-a-Service:** Supabase (Auth, Database, and bulletproof Row Level Security)
*   **Testing:** Vitest (keeping our bill-splitting math flawless)

---

## 🛡️ Security (Fort Knox for Fridge Content)

We take security seriously so you don't have to worry about your data (or your snacks) getting hijacked.
*   **XSS Protection:** Rigorous input sanitization. No malicious scripts allowed in the grocery list.
*   **Ironclad Privacy:** Row Level Security (RLS) guarantees that *only you* can read or write data in your Personal Tab.
*   **Secret Keeping:** Environment variables handle all credentials. We *never* leak secrets to GitHub.
*   **Session Control:** Secure, seamless user management powered by Supabase Auth.

---

## 🏗️ Software Engineering Practices

We don't just write code; we write *nice* code.
*   **Feature Branch Workflow:** Develop on a branch -> Merge to `dev` -> Release to `main`. No cowboy coding on main.
*   **Semantic Commits:** Keeping the git history clean and readable (e.g., `feat: added snack protection`, `fix: math was mathing wrong`).
*   **Separation of Concerns:** Clean architecture with dedicated folders for services, pages, components, and utils.
*   **Bulletproof Math:** Unit-tested bill-splitting logic to prevent fractional-penny arguments.
*   **Smooth UX:** Elegant loading states on all data fetching. No awkward layout shifts here.
---
## 🚀 Local Setup

Want to run RUni locally? Let's get you set up in less time than it takes to argue about whose turn it is to take out the trash.

1. Clone the repo:

Bash
git clone [https://github.com/yourusername/runi.git](https://github.com/yourusername/runi.git)
cd runi

2. Install the dependencies:

Bash
npm install

3. Feed the environment: Create a .env file in the root directory and drop in your Supabase credentials:

Code snippet
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

4. Fire it up:

Bash
npm run dev

🧪 Running Tests

Does the math actually add up? 
Check for yourself:

Bash
npm test

---

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI pieces (Navbar, Spinner, etc.)
├── pages/        # Full page views (Groceries, Personal, Login)
├── services/     # All Supabase API calls and database interactions
├── hooks/        # Custom React hooks for clean state management
└── utils/        # Helper functions (sanitize, billSplitting math)

'''text
Bash
npm test
