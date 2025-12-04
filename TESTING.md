# Testing Guide

This document outlines how to test all functionality of the Comment System.

## Quick Start

### Terminal 1 - Backend
```bash
./start-backend.sh
```
Or manually:
```bash
cd backend/backend
source venv/bin/activate
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
./start-frontend.sh
```
Or manually:
```bash
cd frontend
npm run dev
```

## Application URLs

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000/api/comments/
- **Django Admin**: http://localhost:8000/admin/

## Feature Testing Checklist

### ✅ Part 1: Backend API

#### 1. List All Comments
**Endpoint**: `GET /api/comments/`

```bash
curl http://localhost:8000/api/comments/
```

**Expected**: JSON array of all comments with fields: id, author, text, date, likes, image

#### 2. Create Comment
**Endpoint**: `POST /api/comments/`

```bash
curl -X POST http://localhost:8000/api/comments/ \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a test comment from the API"}'
```

**Expected**:
- Returns created comment with `201 Created` status
- Author automatically set to "Admin"
- Date automatically set to current timestamp
- ID auto-generated

#### 3. Update Comment
**Endpoint**: `PATCH /api/comments/{id}/`

```bash
curl -X PATCH http://localhost:8000/api/comments/1/ \
  -H "Content-Type: application/json" \
  -d '{"text":"This comment has been updated"}'
```

**Expected**:
- Returns updated comment with `200 OK` status
- Only text field is updated
- Other fields remain unchanged

#### 4. Delete Comment
**Endpoint**: `DELETE /api/comments/{id}/`

```bash
curl -X DELETE http://localhost:8000/api/comments/1/
```

**Expected**:
- Returns `204 No Content` status
- Comment is removed from database
- Subsequent GET returns 404

### ✅ Part 2: Frontend Display

#### Visual Elements to Verify

1. **Page Layout**
   - [ ] Clean, modern design with gradient background
   - [ ] Centered content area with max-width
   - [ ] Header showing "Comments" and total count

2. **Comment Cards**
   - [ ] Each comment in a white card with shadow
   - [ ] Cards have hover effect (shadow deepens)
   - [ ] Proper spacing between cards

3. **Comment Content Display**
   - [ ] Author name displayed prominently
   - [ ] Avatar/image shows (or placeholder with first letter)
   - [ ] Comment text is readable with good line height
   - [ ] Date formatted as "Month Day, Year" (e.g., "Sep 1, 2015")
   - [ ] Likes count with emoji (👍 X likes)

4. **Responsive Design**
   - [ ] Works on desktop (800px+ width)
   - [ ] Adapts to mobile (try resizing browser)
   - [ ] Padding adjusts appropriately

### ✅ Part 3: Frontend CRUD Operations

#### 1. Add Comment

**Steps**:
1. Navigate to http://localhost:5174
2. Find "Add a Comment" section at top
3. Type text in the textarea
4. Click "Post Comment" button

**Expected**:
- [ ] Button disables while submitting
- [ ] Button text changes to "Posting..."
- [ ] New comment appears at top of list
- [ ] Author is "Admin"
- [ ] Date is current date
- [ ] Form clears after submission
- [ ] Likes start at 0

**Edge Cases**:
- [ ] Empty text cannot be submitted (button disabled)
- [ ] Whitespace-only text cannot be submitted

#### 2. Edit Comment

**Steps**:
1. Click "Edit" button on any comment
2. Comment text becomes editable in textarea
3. Modify the text
4. Click "Save" button

**Expected**:
- [ ] Edit/Delete buttons hide during edit mode
- [ ] Textarea appears with current text
- [ ] Save and Cancel buttons appear
- [ ] After saving:
  - Comment updates immediately in UI
  - Edit mode closes
  - Updated text displays

**Cancel Flow**:
1. Click "Edit" on a comment
2. Modify the text
3. Click "Cancel"

**Expected**:
- [ ] Changes are discarded
- [ ] Original text remains
- [ ] Edit mode closes

#### 3. Delete Comment

**Steps**:
1. Click "Delete" button on any comment
2. Confirm deletion in browser alert

**Expected**:
- [ ] Confirmation dialog appears
- [ ] After confirming:
  - Comment removes from list immediately
  - Total count decreases
  - No visual artifacts

**Cancel Flow**:
1. Click "Delete" on a comment
2. Click "Cancel" in confirmation dialog

**Expected**:
- [ ] Comment remains in list
- [ ] No changes occur

### Error Handling

#### Backend Down
**Test**: Stop Django server while frontend is running

**Expected**:
- [ ] Error message displays in red banner
- [ ] Error can be dismissed with × button
- [ ] Appropriate error message shown

#### Network Error
**Test**: Modify API URL to invalid endpoint in `frontend/src/services/api.js`

**Expected**:
- [ ] Error message appears
- [ ] Application doesn't crash
- [ ] Can still interact with UI

### Loading States

#### Initial Load
**Test**: Refresh page with backend running

**Expected**:
- [ ] Spinner displays
- [ ] "Loading comments..." text shows
- [ ] After load, content appears

### UI/UX Details

#### Buttons
- [ ] Edit button: Blue/purple color
- [ ] Delete button: Red color
- [ ] Save button: Green color
- [ ] Cancel button: Gray color
- [ ] All buttons have hover effects
- [ ] Disabled buttons have reduced opacity

#### Forms
- [ ] Textareas have focus state (blue border)
- [ ] Textareas are resizable vertically
- [ ] Forms have proper spacing

#### Animations
- [ ] Cards have smooth hover transition
- [ ] Button colors transition smoothly
- [ ] Loading spinner rotates

## Data Verification

### Check Database Directly

#### View all comments in database:
```bash
cd backend/backend
source venv/bin/activate
python manage.py shell
```

Then in Python shell:
```python
from comments.models import Comment
comments = Comment.objects.all()
for c in comments:
    print(f"{c.id}: {c.author} - {c.text[:50]}")
```

### Reset Database

If you need to reset to original state:
```bash
cd backend/backend
source venv/bin/activate
rm db.sqlite3
python manage.py migrate
python load_comments.py
```

## Performance Tests

### Load Test (Optional)
Test with many comments to ensure UI performs well.

Create 100 test comments:
```bash
cd backend/backend
source venv/bin/activate
python manage.py shell
```

```python
from comments.models import Comment
for i in range(100):
    Comment.objects.create(
        author=f"User{i}",
        text=f"Test comment number {i}",
        likes=i
    )
```

**Expected**:
- [ ] All comments load
- [ ] Scroll is smooth
- [ ] No performance degradation

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Code Quality Checks

### Backend
- [ ] Code follows PEP 8 style guide
- [ ] Models are well-defined with proper field types
- [ ] API returns proper HTTP status codes
- [ ] CORS properly configured

### Frontend
- [ ] Components are properly separated
- [ ] No console errors in browser
- [ ] Code is readable and well-organized
- [ ] CSS is modular (one CSS file per component)

## Common Issues & Solutions

### Issue: Frontend can't connect to backend
**Solution**:
1. Verify Django is running on port 8000
2. Check CORS settings in `settings.py`
3. Verify API_BASE_URL in `frontend/src/services/api.js`

### Issue: Comments don't display
**Solution**:
1. Check browser console for errors
2. Verify API returns data: `curl http://localhost:8000/api/comments/`
3. Check Django terminal for errors

### Issue: Can't add/edit/delete
**Solution**:
1. Check network tab in browser dev tools
2. Verify Django logs for errors
3. Check that API endpoints are properly configured

## Demo Preparation

Before presenting:

1. **Reset to clean state**:
```bash
cd backend/backend
rm db.sqlite3
python manage.py migrate
python load_comments.py
```

2. **Start both servers**:
   - Terminal 1: `./start-backend.sh`
   - Terminal 2: `./start-frontend.sh`

3. **Open browser**: http://localhost:5174

4. **Prepare talking points**:
   - Clean, modern UI design
   - RESTful API architecture
   - Real-time updates without page refresh
   - Proper error handling
   - Code organization and maintainability
