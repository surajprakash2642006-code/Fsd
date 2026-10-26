### Installation
```bash
cd Budget-Tracker/frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173/**

### Build for Production
```bash
cd Budget-Tracker/frontend
npm run build
npm run preview
```

Run Docker Compose from the repository root with `docker compose up --build`.
The Vite application is in `frontend/`; the API is in `backend/`.
For Vercel, set the project root directory to `frontend`.

### Dashboard insights and alerts
The dashboard includes monthly spending-by-category and income-versus-expense charts,
authenticated live updates over WebSockets, and dismissible monthly spending popups:
yellow when expenses reach 80% of income and red at 90%. Category budget progress
indicators warn as spending approaches their individual limits.
Existing budgets can be edited or removed from the Budgets tab; removing a budget
does not remove its transactions.
