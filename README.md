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
Getting Started (Local)Requirements
Node.js 18+
MongoDB (local or MongoDB Atlas)
1. Clone the repoBashgit clone https://github.com/abelixir/trade.git
cd trade2. Backend setupBashcd backend
npm installCreate backend/.env:envMONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000Start the API:Bashnpm run dev
# or
npm startAPI runs at http://localhost:50003. Frontend setupBashcd frontend
npm installCreate frontend/.env:envVITE_API_URL=http://localhost:5000Start the app:Bashnpm run devApp runs at http://localhost:5173 (or the port Vite prints)Environment VariablesBackend

VariableDescriptionMONGO_URIMongoDB connection stringJWT_SECRETSecret used to sign JWT tokensPORTServer port (default 5000)Frontend

VariableDescriptionVITE_API_URLBackend base URL (no trailing slash)API Overview



MethodEndpointDescriptionPOST/api/auth/registerCreate accountPOST/api/auth/loginLoginGET/api/tradesList user tradesPOST/api/tradesCreate tradePUT/api/trades/:idUpdate tradeDELETE/api/trades/:idDelete tradeGET/api/weekly-analysisList weekly analysesPOST/api/weekly-analysisCreate weekly analysisPUT/api/weekly-analysis/:idUpdate weekly analysisDELETE/api/weekly-analysis/:idDelete weekly analysisGET/api/certificatesList certificatesPOST/api/certificatesCreate certificateDELETE/api/certificates/:idDelete certificateProtected routes require:httpAuthorization: Bearer <token>DeploymentBackend (Render)
New Web Service from this repo
Root Directory: backend
Build: npm install
Start: npm start
Set env vars: MONGO_URI, JWT_SECRET
Frontend (Vercel)
Import this repo
Root Directory: frontend
Framework: Vite
Set env var:envVITE_API_URL=https://your-render-api-url.onrender.com
frontend/vercel.json handles React Router SPA rewrites.Notes
Free Render services sleep when idle — the first request after sleep can take 30–60 seconds
Do not commit .env files
Image uploads (weekly analysis / certificates) should stay under ~1.5MB each
AuthorBuilt by Abiy (@abelixir)LicenseThis project is for personal / educational use.text---

Replace:

- `https://tradevibe-hazel.vercel.app` with your real Vercel link  
- Author section if you want a different name/handle  

Then:

```bash
git add README.md
git commit -m "Add project README"
git push origin main