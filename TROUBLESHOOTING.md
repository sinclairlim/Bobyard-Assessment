# Troubleshooting Guide

## Common Issues and Solutions

### ❌ Error: "Failed to load comments. Please try again later."

**Possible Causes:**
1. Backend server not running
2. CORS configuration issue
3. Database not initialized
4. Port conflict

**Solutions:**

#### 1. Verify Backend is Running
```bash
# Check if Django is running
curl http://localhost:8000/api/comments/

# Should return JSON array of comments
# If you get "Connection refused", start the backend:
cd backend/backend
source venv/bin/activate
python manage.py runserver
```

#### 2. Check CORS Settings
The backend should allow requests from `http://localhost:5174` (or whatever port Vite is using).

In `backend/backend/config/settings.py`, verify:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

If Vite is using a different port (check the Vite console), add it:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",  # Add the actual port
    "http://127.0.0.1:3000",
]
```

Then restart Django server.

#### 3. Verify Database Has Data
```bash
cd backend/backend
source venv/bin/activate
python manage.py shell
```

In Python shell:
```python
from comments.models import Comment
print(Comment.objects.count())  # Should show 16
```

If it shows 0, reload data:
```bash
python load_comments.py
```

#### 4. Hard Refresh Browser
- Chrome/Firefox: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- This clears cache and reloads

#### 5. Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)

Common errors and fixes:
- **CORS error**: Update CORS_ALLOWED_ORIGINS in settings.py
- **Network error**: Check backend is running on port 8000
- **404 Not Found**: Verify URL in frontend/src/services/api.js

---

### ❌ Backend Won't Start

**Error: Port 8000 already in use**

Solution:
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
python manage.py runserver 8001

# If using different port, update frontend API URL in:
# frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8001/api';
```

**Error: No module named 'rest_framework'**

Solution:
```bash
cd backend/backend
source venv/bin/activate
pip install -r requirements.txt
```

**Error: Database doesn't exist**

Solution:
```bash
python manage.py migrate
python load_comments.py
```

---

### ❌ Frontend Won't Start

**Error: Cannot find module**

Solution:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: Port already in use**

Vite will automatically try the next available port. Check the console output for the actual port and visit that URL.

---

### ❌ Comments Display But Can't Add/Edit/Delete

**Check Browser Console**

Look for API errors. Common issues:

1. **405 Method Not Allowed**
   - Backend isn't accepting the HTTP method
   - Check ViewSet is using `ModelViewSet` not `ReadOnlyModelViewSet`

2. **403 Forbidden**
   - CSRF token issue
   - For development, CSRF is disabled for API endpoints

3. **400 Bad Request**
   - Invalid data being sent
   - Check serializer validation rules

**Test API Directly**

Add comment:
```bash
curl -X POST http://localhost:8000/api/comments/ \
  -H "Content-Type: application/json" \
  -d '{"text":"Test from curl"}'
```

Update comment:
```bash
curl -X PATCH http://localhost:8000/api/comments/1/ \
  -H "Content-Type: application/json" \
  -d '{"text":"Updated text"}'
```

Delete comment:
```bash
curl -X DELETE http://localhost:8000/api/comments/1/
```

---

### ❌ Styling Looks Broken

**Clear Browser Cache**
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)

**Check CSS Files**
Make sure all CSS files exist:
- `frontend/src/App.css`
- `frontend/src/index.css`
- `frontend/src/components/Comment.css`
- `frontend/src/components/CommentList.css`

**Check Import Statements**
In component files, verify CSS imports:
```javascript
import './Comment.css';  // Check path is correct
```

---

### ❌ "Admin" Author Not Being Set

Check `backend/backend/comments/views.py`:

```python
def create(self, request, *args, **kwargs):
    data = request.data.copy()
    data['author'] = 'Admin'  # This line sets the author
    serializer = self.get_serializer(data=data)
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)
    headers = self.get_success_headers(serializer.data)
    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
```

---

### 🔧 Complete Reset

If nothing works, reset everything:

```bash
# 1. Stop all servers (Ctrl+C in both terminals)

# 2. Reset backend
cd backend/backend
rm db.sqlite3
python manage.py migrate
python load_comments.py

# 3. Reset frontend
cd ../../frontend
rm -rf node_modules package-lock.json
npm install

# 4. Start fresh
# Terminal 1
cd backend/backend && source venv/bin/activate && python manage.py runserver

# Terminal 2
cd frontend && npm run dev

# 5. Visit the new URL shown in Terminal 2
```

---

### 📊 Verify Everything is Working

Run these quick checks:

1. **Backend API**:
   ```bash
   curl http://localhost:8000/api/comments/ | python3 -m json.tool
   ```
   Should show array of comments

2. **Frontend**:
   Visit http://localhost:5174 (or port shown in Vite console)
   Should see comment list

3. **CRUD Operations**:
   - Add a comment via the form
   - Edit an existing comment
   - Delete a comment
   All should work without errors

---

### 🆘 Still Having Issues?

**Check the logs:**

Backend logs (in Django terminal):
- Look for errors in red
- Check for 500 errors
- Verify requests are being received

Frontend logs (Browser console):
- Press F12 to open DevTools
- Check Console tab for errors
- Check Network tab to see API requests

**Get detailed error info:**

In `backend/backend/config/settings.py`, ensure:
```python
DEBUG = True  # Should be True for development
```

This will show detailed error pages if something goes wrong.

---

### ✅ Health Check Script

Quick way to verify everything:

```bash
# Check backend
curl -s http://localhost:8000/api/comments/ > /dev/null && echo "✅ Backend OK" || echo "❌ Backend Down"

# Check frontend
curl -s http://localhost:5174 > /dev/null && echo "✅ Frontend OK" || echo "❌ Frontend Down"

# Check data
cd backend/backend && source venv/bin/activate && python -c "from comments.models import Comment; print(f'✅ {Comment.objects.count()} comments in database')"
```

---

### 💡 Pro Tips

1. **Always check both terminal windows** for errors
2. **Use browser DevTools** - Network tab shows all API calls
3. **Test API with curl** before debugging frontend
4. **Check the port numbers** - Vite may use different ports
5. **CORS issues** are common - make sure origins match exactly
