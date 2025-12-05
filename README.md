# Comment System - Bobyard Assessment

A full-stack comment system with CRUD functionality, built with Django REST Framework and React.

## Setup Guide

```bash
# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python load_comments.py
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5174` in your browser.

## Tech Stack

**Backend**: Django 4.2.7 + Django REST Framework 3.14.0, SQLite
**Frontend**: React 18 (Vite), Axios

## Features

- RESTful API with full CRUD operations
- Clean, modern card-based UI
- Inline editing and deletion
- Auto-set author to "Admin" with timestamps
- Edit tracking ("Edited by Admin" indicator)
- Real-time UI updates
- Input validation and error handling

## API Endpoints

- `GET /api/comments/` - List all comments
- `POST /api/comments/` - Create comment (body: `{"text": "..."}`)
- `PATCH /api/comments/{id}/` - Update comment text
- `DELETE /api/comments/{id}/` - Delete comment

## Project Structure

```
Bobyard-Assessment/
├── backend/
│   ├── config/           # Django settings
│   ├── comments/         # Comments app (models, views, serializers)
│   ├── manage.py
│   ├── load_comments.py  # Data loader
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Comment, CommentList
│   │   ├── services/     # API client
│   │   └── App.jsx
│   └── package.json
└── comments.json         # Initial data
```

## Key Implementation Details

### Backend
- **ModelViewSet** for clean CRUD operations
- **Read-only fields** on updates (author, likes, image)
- **Text validation** prevents empty comments
- **Custom save logic** tracks edits only when text changes
- **CORS** configured for localhost ports 3000, 5173, 5174

### Frontend
- **Component separation**: CommentList (data) and Comment (display)
- **Functional state updates** to prevent race conditions
- **Environment config**: API URL via `VITE_API_BASE_URL`
- **UX features**: Loading states, confirmation dialogs, inline editing
