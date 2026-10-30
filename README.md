# TradeVibe

A modern trading journal built for traders who want real consistency.

Track trades, review performance, journal emotions, and follow a clear path from beginner to disciplined trader — without spreadsheets.

**Live app:** [Add your Vercel URL here]  
**API:** [https://tradevibe-api.onrender.com](https://tradevibe-api.onrender.com)

---

## Features

- **Dashboard** — Total P&L, win rate, profit factor, equity curve, recent trades
- **Add Trade** — Fast trade logging (symbol, direction, entry, exit, size, date)
- **Journal** — Notes, emotions, filters, search, and edit per trade
- **Analytics** — Performance stats, win/loss breakdown, monthly calendar heatmap
- **Weekly Analysis** — Weekly plans with notes, expectations, and chart uploads
- **Certificates** — Store trading course certificates and achievements
- **Roadmap** — Structured learning path from foundations to mastery
- **Auth** — Register / login with JWT protection

---

## Tech Stack

| Layer | Stack |
|--------|--------|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Deploy | Frontend → Vercel · Backend → Render |

---

## Project Structure

```text
trade/
├── frontend/          # React (Vite) app
│   ├── src/
│   │   ├── components/
│   │   ├── context/       # AuthContext
│   │   ├── pages/
│   │   ├── services/      # API layer
│   │   └── ...
│   └── ...
├── backend/           # Express API
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
└── README.md