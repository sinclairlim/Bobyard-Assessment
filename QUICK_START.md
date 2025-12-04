# Quick Start Guide

## ⚡ Fastest Way to Get Running

### 1. Start Backend (Terminal 1)
```bash
cd backend/backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### 3. Open Browser
Visit: **http://localhost:5174**

---

## 🎯 What You'll See

- A beautiful gradient background
- List of 16 pre-loaded comments
- "Add a Comment" form at the top
- Each comment showing:
  - Author name with avatar/placeholder
  - Comment text
  - Date
  - Likes count
  - Edit and Delete buttons

---

## ✨ Try These Features

### Add a Comment
1. Type in the "Add a Comment" textarea
2. Click "Post Comment"
3. See your new comment appear at the top with "Admin" as author

### Edit a Comment
1. Click "Edit" on any comment
2. Modify the text
3. Click "Save" to update or "Cancel" to discard

### Delete a Comment
1. Click "Delete" on any comment
2. Confirm the deletion
3. Comment disappears immediately

---

## 🔧 API Endpoints

Base URL: `http://localhost:8000/api`

- **GET** `/comments/` - List all comments
- **POST** `/comments/` - Create comment (body: `{"text": "..."}`)
- **PATCH** `/comments/{id}/` - Update comment (body: `{"text": "..."}`)
- **DELETE** `/comments/{id}/` - Delete comment

---

## 📦 Project Structure

```
backend/backend/     ← Django API
  ├── comments/      ← Comments app
  ├── config/        ← Settings
  └── manage.py

frontend/            ← React app
  └── src/
      ├── components/  ← UI components
      └── services/    ← API client
```

---

## 🚨 Troubleshooting

**Frontend can't connect to backend?**
- Make sure Django is running on port 8000
- Check http://localhost:8000/api/comments/ in browser

**Port already in use?**
- Django: Use different port with `python manage.py runserver 8001`
- React: Vite will auto-detect and use next available port

**No comments showing?**
- Run data loader: `cd backend/backend && python load_comments.py`

---

## 📚 More Info

- Full setup: See [README.md](README.md)
- Testing: See [TESTING.md](TESTING.md)
- Overview: See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## 🎉 You're All Set!

The application is now running and ready for demo!

**Backend**: http://localhost:8000/api/comments/
**Frontend**: http://localhost:5174
