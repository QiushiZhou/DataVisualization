# Data Visualization Application

A modern web application for data visualization and management.

## Technology Stack

### Frontend
- Next.js
- React
- Chart.js
- Ant Design
- TypeScript

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Python

## Project Structure

```
.
├── frontend/           # Next.js frontend application
│   ├── src/           # Source code
│   ├── public/        # Static files
│   └── package.json   # Dependencies
│
└── backend/           # FastAPI backend application
    ├── app/           # Application code
    ├── migrations/    # Database migrations
    └── requirements.txt # Python dependencies
```

## Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Backend (Railway)
- Platform: Railway
- Database: PostgreSQL
- Auto-deployment enabled

### Frontend (Vercel)
- Platform: Vercel
- Production URL: [Your production URL]
- Auto-deployment enabled

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `ENVIRONMENT`: development/production
- `FRONTEND_URL`: Frontend application URL

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL