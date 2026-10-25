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
