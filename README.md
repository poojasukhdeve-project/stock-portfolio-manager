# Stock Portfolio Manager — Full-Stack FinTech Application

A full-stack financial web application that lets users manage and track stock investments, with role-based access for Admins and Investors, dual REST + GraphQL APIs, and automatic portfolio performance calculations.

**Author:** Pooja Sukhdeve — MS in Computer Science, Boston University
**Demo:** https://youtu.be/WiU-whS36ms

---

## Problem Statement

How can individual investors efficiently track and manage their stock portfolios on a platform that's secure, scalable, and easy to use — while still surfacing meaningful insight into how their investments are performing?

---

## Solution

Stock Portfolio Manager centralizes portfolio management into a single, role-based platform. Admins manage the available stock catalog; investors buy stocks and track their holdings, with the system automatically calculating total invested, current value, profit/loss, and percentage return in real time. The API is exposed both as REST (tested via Postman) and GraphQL (tested via Apollo Server), giving flexibility in how clients consume the data.

---

## Features

- User registration & login with JWT authentication
- **Role-based access control** — separate Admin and Investor permissions
- Admin: create, update, and delete stocks
- Investor: buy stocks, manage portfolio, view profit/loss
- Automatic calculation of:
  - Total Invested
  - Current Portfolio Value
  - Profit / Loss
  - Percentage Return
- REST API (tested with Postman)
- GraphQL API (tested with Apollo Server)
- Interactive React dashboard

---

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas), Mongoose |
| Authentication | JWT |
| API Styles | REST + GraphQL |

---

## System Architecture

**3-Tier Client-Server Architecture**

- **Presentation Layer (Frontend)** — React, dashboard UI, REST + GraphQL integration
- **Application Layer (Backend)** — Express.js, REST routes, GraphQL schema + resolvers, JWT authentication, role-based middleware
- **Data Layer (Database)** — MongoDB with Mongoose models for `User`, `Stock`, and `Portfolio`

---

## API Overview

**REST base URL:** `http://localhost:5000/api`
- `POST /auth/register` — create a new user (investor or admin)
- `POST /auth/login` — authenticate and receive a JWT
- `GET /stocks` — list available stocks

**GraphQL endpoint:** `http://localhost:5000/graphql`
- `stocks` query — returns symbol, company name, current price
- `myPortfolio` query — returns portfolio `summary` (totalInvested, totalCurrentValue, profitLoss) and per-holding `portfolio` details (quantity, investedAmount, stock info)

---

## Default Seeded Users

The database auto-initializes with sample users and stocks on server start:

| Role | Email | Password | Capabilities |
|---|---|---|---|
| Admin | poojasukhdeve@test.com | 123456 | Add / update / delete stocks |
| Investor | pooja_investor@test.com | 123456 | View stocks, buy stocks, view portfolio & profit/loss |
| Investor | pooja_investor2@test.com | 12345678 | Same as above |

Sample stocks seeded: **AAPL, GOOGL, MSFT**

---

## Key Challenges & Solutions

### 1. Securing user authentication with role-based access
**Problem:** Needed to make sure only authenticated users could access the API, and that Admin-only actions (like adding or deleting stocks) couldn't be triggered by an Investor account.
**Fix:** Implemented JWT-based authentication combined with role middleware that checks the user's role (`admin` vs `investor`) before allowing access to protected routes.
**Takeaway:** Authentication answers "who are you?" but authorization answers "what are you allowed to do?" — both layers were necessary, not just a login check.

### 2. 401/403 Unauthorized errors while testing REST and GraphQL
**Problem:** While testing endpoints in Postman and the GraphQL sandbox, requests to protected routes (like `myPortfolio` or admin stock actions) repeatedly failed with 401/403 Unauthorized errors, even though the login endpoint itself worked correctly.
**Fix:** The issue traced back to the JWT not being attached correctly on protected requests — after logging in and getting a token back, it needed to be explicitly passed as an `Authorization: Bearer <token>` header on every subsequent request (in both Postman and the GraphQL sandbox), since neither tool persists auth state automatically between requests.
**Takeaway:** A working login endpoint doesn't mean the rest of the API is authenticated — every protected request needs the token attached manually when testing outside a browser session, and REST tools and GraphQL sandboxes both require this to be repeated for each call.

### 3. Reliable frontend-backend communication
**Problem:** API calls between the React frontend and Express backend needed to handle failures gracefully instead of breaking the UI.
**Fix:** Used Axios for requests with consistent error handling, so failed or slow API calls degrade gracefully rather than crashing the interface.
**Takeaway:** A full-stack app is only as reliable as its weakest network call — proper error handling at the API boundary prevents backend issues from becoming frontend bugs.

### 4. Managing state in React
**Problem:** Portfolio and stock data needed to stay in sync across multiple components as users bought/sold stocks.
**Fix:** Managed component state efficiently using React props and hooks, keeping data flow predictable between parent and child components.
**Takeaway:** Clean state management up front avoids a lot of hard-to-trace bugs later, especially once more components start depending on the same data.

### 5. Designing the database schema for portfolios
**Problem:** Needed MongoDB schemas that could represent users, stocks, and per-user holdings without becoming rigid or hard to query as features grew (e.g., calculating profit/loss on the fly).
**Fix:** Designed separate `User`, `Stock`, and `Portfolio` Mongoose models with clear relationships, so profit/loss and portfolio value could be computed from stored `investedAmount` and live `currentPrice` fields.
**Takeaway:** Schema design decisions made early — even in a flexible NoSQL database — still shape how easily you can query and compute derived values like returns later.

### 6. Supporting two API styles from one backend
**Problem:** Needed to expose the same underlying data (stocks, portfolios) through both REST and GraphQL without duplicating business logic.
**Fix:** Kept core logic (auth, calculations) in shared service/model layers, with REST routes and GraphQL resolvers each calling into that shared logic rather than reimplementing it.
**Takeaway:** Supporting multiple API styles is manageable as long as the business logic lives in one place — the API layer should be a thin wrapper, not where the real logic lives.

---

## Key Insights

- A centralized platform meaningfully reduces the manual effort of tracking investments across sources
- Role-based access control is essential once more than one type of user touches the same data
- Testing auth-protected APIs outside the browser (Postman, GraphQL sandbox) requires deliberately managing tokens, which is different from how a browser session handles it
- Supporting both REST and GraphQL on the same backend is a good way to understand the trade-offs between the two API styles

---

## Impact

- Designed a scalable full-stack system with role-based access for multiple user types
- Implemented dual REST + GraphQL APIs backed by shared business logic
- Automated portfolio performance calculations (invested amount, current value, profit/loss, % return)
- Implemented JWT-based authentication and role middleware for secure, permissioned access
- Structured MongoDB/Mongoose schemas to support real-time portfolio computations
- Centralized portfolio management into a single platform with pre-seeded demo data for easy evaluation

---

## Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/poojasukhdeve-project/stock-portfolio-manager.git
```

**2. Configure environment variables** — create `server/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**3. Start the backend**
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5000`, with GraphQL available at `http://localhost:5000/graphql`. On first run, it auto-seeds 2 users and sample stocks (AAPL, GOOGL, MSFT).

**4. Start the frontend**
```bash
cd client
npm install
npm start
```
Frontend runs on `http://localhost:3000`.

**5. Test the API**
- REST: import into Postman using base URL `http://localhost:5000/api`
- GraphQL: open `http://localhost:5000/graphql` in the browser sandbox
- Log in with a seeded account (see Default Seeded Users above) and attach the returned JWT as a Bearer token on protected requests

---

## Future Improvements

- Real-time stock price API integration
- Portfolio analytics dashboard with interactive charts
- AI-based stock recommendation system
