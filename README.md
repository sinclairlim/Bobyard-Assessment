# Comment System - Bobyard Assessment

A full-stack comment system with CRUD functionality, built with Django REST Framework and React.

## Tech Stack

### Backend
- **Framework**: Django 4.2.7 + Django REST Framework 3.14.0
- **Database**: SQLite (PostgreSQL-ready configuration included)
- **CORS**: django-cors-headers 4.3.0
- **Python**: 3.12.0

### Frontend
- **Framework**: React 18 (Vite)
- **HTTP Client**: Axios
- **Styling**: CSS3

## Features

### Part 1: Backend API
- ✅ RESTful API with proper HTTP methods
- ✅ List all comments (`GET /api/comments/`)
- ✅ Add new comment (`POST /api/comments/`)
- ✅ Edit comment text (`PATCH /api/comments/{id}/`)
- ✅ Delete comment (`DELETE /api/comments/{id}/`)
- ✅ Auto-set author to "Admin" and current timestamp on creation

### Part 2: Frontend Display
- ✅ Clean, modern card-based design
- ✅ Display text, author, date, likes, and images
- ✅ Responsive layout
- ✅ Avatar display (image or placeholder)
- ✅ Formatted dates
- ✅ Loading states and error handling

### Part 3: Frontend CRUD
- ✅ Add new comments via form
- ✅ Edit existing comments inline
- ✅ Delete comments with confirmation
- ✅ Real-time UI updates

## Project Structure

```
Bobyard-Assessment/
├── backend/
│   ├── backend/
│   │   ├── config/           # Django settings
│   │   ├── comments/         # Comments app
│   │   │   ├── models.py     # Comment model
│   │   │   ├── serializers.py
│   │   │   ├── views.py      # API ViewSet
│   │   │   └── urls.py
│   │   ├── manage.py
│   │   ├── load_comments.py  # Data loader script
│   │   └── db.sqlite3
│   ├── venv/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Comment.jsx
│   │   │   ├── Comment.css
│   │   │   ├── CommentList.jsx
│   │   │   └── CommentList.css
│   │   ├── services/
│   │   │   └── api.js        # API client
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
└── comments.json             # Initial data
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Load initial data:
```bash
python load_comments.py
```

6. Start the development server:
```bash
python manage.py runserver
```

Backend will be running at: `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will be running at: `http://localhost:5174`

## API Endpoints

### List Comments
```
GET /api/comments/
```

### Create Comment
```
POST /api/comments/
Body: { "text": "Your comment here" }
```
Note: Author is automatically set to "Admin" and date to current time.

### Update Comment
```
PATCH /api/comments/{id}/
Body: { "text": "Updated text" }
```

### Delete Comment
```
DELETE /api/comments/{id}/
```

## Database Configuration

The project currently uses SQLite for simplicity. To switch to PostgreSQL:

1. Install PostgreSQL and create a database named `comments_db`

2. Update `backend/backend/config/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'comments_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

3. Run migrations again:
```bash
python manage.py migrate
python load_comments.py
```

## Design Decisions

### Backend
- **ViewSet**: Used Django REST Framework's `ModelViewSet` for clean, DRY code
- **Auto-Admin**: Overrode `create()` method to automatically set author to "Admin"
- **Ordering**: Comments ordered by date (newest first) via model Meta
- **CORS**: Configured to allow frontend origin for development

### Frontend
- **Component Structure**: Separated concerns (CommentList for data, Comment for display)
- **State Management**: React hooks for simple, effective state management
- **API Service**: Centralized API calls in `services/api.js` for maintainability
- **UX**: Inline editing, confirmation dialogs, loading states, error handling
- **Styling**: Clean, modern design with gradients, hover effects, and responsive layout

## Testing

### Manual Testing

1. **List Comments**: Visit `http://localhost:5174` - should see all comments
2. **Add Comment**: Type in the form and click "Post Comment"
3. **Edit Comment**: Click "Edit" on any comment, modify text, click "Save"
4. **Delete Comment**: Click "Delete" on any comment, confirm the dialog

### API Testing with curl

```bash
# List all comments
curl http://localhost:8000/api/comments/

# Create a comment
curl -X POST http://localhost:8000/api/comments/ \
  -H "Content-Type: application/json" \
  -d '{"text":"Test comment"}'

# Update a comment
curl -X PATCH http://localhost:8000/api/comments/1/ \
  -H "Content-Type: application/json" \
  -d '{"text":"Updated text"}'

# Delete a comment
curl -X DELETE http://localhost:8000/api/comments/1/
```

## Future Enhancements

- Add user authentication
- Implement likes functionality
- Add comment replies/threading
- Add pagination for large comment lists
- Add real-time updates with WebSockets
- Add image upload for comments
- Add search and filter functionality
