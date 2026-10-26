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

### Admin panel
The read-only admin panel shows account and transaction counts, current-month
income, expenses and budget counts, a six-month account registration trend, and
searchable, role-filtered accounts. It does not display
passwords or individual transaction details. Admins land directly on the panel;
Overview, Transactions and Budgets are hidden for admin accounts.

To create or promote the configured admin account automatically at backend startup,
set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend environment. Use a unique
password of at least 6 characters; never put the password in source control.
Optionally set `ADMIN_NAME`.

For local Node.js, put these values in `backend/.env` and restart the backend. For
Docker Compose, put them in the repository-root `.env` file and run
`docker compose up --build -d backend`. For Render, set them in the backend
service's Environment settings and redeploy. On startup, the backend creates the
admin if the email is new, or promotes an existing matching account without
changing its password. Sign in using that email and password, then select Admin.
