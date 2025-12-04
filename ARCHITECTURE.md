# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│                   http://localhost:5174                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │              React Frontend (Vite)                 │     │
│  │                                                     │     │
│  │  ┌─────────────┐  ┌──────────────┐               │     │
│  │  │ CommentList │  │   Comment    │               │     │
│  │  │ (Container) │──│(Presentation)│               │     │
│  │  └─────────────┘  └──────────────┘               │     │
│  │         │                                          │     │
│  │         │ uses                                     │     │
│  │         ▼                                          │     │
│  │  ┌─────────────┐                                  │     │
│  │  │ api.js      │                                  │     │
│  │  │ (Axios)     │                                  │     │
│  │  └─────────────┘                                  │     │
│  └──────────┬─────────────────────────────────────────┘     │
└─────────────┼─────────────────────────────────────────────┘
              │
              │ HTTP Requests (JSON)
              │ GET, POST, PATCH, DELETE
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Django Backend                             │
│                http://localhost:8000                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Django REST Framework API                  │     │
│  │                                                     │     │
│  │  ┌─────────────────────────────────────────┐      │     │
│  │  │  URLs (config/urls.py)                  │      │     │
│  │  │  Route: /api/comments/                  │      │     │
│  │  └─────────────────┬───────────────────────┘      │     │
│  │                    │                               │     │
│  │                    ▼                               │     │
│  │  ┌─────────────────────────────────────────┐      │     │
│  │  │  ViewSet (comments/views.py)            │      │     │
│  │  │  - list() → GET all                     │      │     │
│  │  │  - create() → POST (auto-set Admin)     │      │     │
│  │  │  - update() → PATCH                     │      │     │
│  │  │  - destroy() → DELETE                   │      │     │
│  │  └─────────────────┬───────────────────────┘      │     │
│  │                    │                               │     │
│  │                    ▼                               │     │
│  │  ┌─────────────────────────────────────────┐      │     │
│  │  │  Serializer (comments/serializers.py)   │      │     │
│  │  │  - Validates data                       │      │     │
│  │  │  - JSON ←→ Model conversion             │      │     │
│  │  └─────────────────┬───────────────────────┘      │     │
│  │                    │                               │     │
│  │                    ▼                               │     │
│  │  ┌─────────────────────────────────────────┐      │     │
│  │  │  Model (comments/models.py)             │      │     │
│  │  │  Comment:                               │      │     │
│  │  │    - id (auto)                          │      │     │
│  │  │    - author (CharField)                 │      │     │
│  │  │    - text (TextField)                   │      │     │
│  │  │    - date (DateTimeField)               │      │     │
│  │  │    - likes (IntegerField)               │      │     │
│  │  │    - image (URLField)                   │      │     │
│  │  └─────────────────┬───────────────────────┘      │     │
│  └────────────────────┼───────────────────────────────┘     │
└─────────────────────┼─────────────────────────────────────┘
                      │
                      ▼
           ┌──────────────────────┐
           │   SQLite Database    │
           │   (db.sqlite3)       │
           │                      │
           │  comments_comment    │
           │  ─────────────────   │
           │  id | author | text  │
           │  date | likes | image│
           └──────────────────────┘
```

## Request Flow Examples

### 1. GET All Comments

```
Browser              Frontend                Backend                Database
   │                    │                       │                      │
   │──Page Load────────▶│                       │                      │
   │                    │                       │                      │
   │                    │──GET /api/comments/──▶│                      │
   │                    │                       │                      │
   │                    │                       │──SELECT * FROM───▶   │
   │                    │                       │                      │
   │                    │                       │◀────Results─────────│
   │                    │                       │                      │
   │                    │◀─────JSON Array──────│                      │
   │                    │                       │                      │
   │◀─Render Comments──│                       │                      │
```

### 2. POST Create Comment

```
Browser              Frontend                Backend                Database
   │                    │                       │                      │
   │──Type & Submit────▶│                       │                      │
   │                    │                       │                      │
   │                    │──POST /api/comments/─▶│                      │
   │                    │  {"text": "..."}      │                      │
   │                    │                       │                      │
   │                    │                       │──Set author="Admin"  │
   │                    │                       │──Set date=now()      │
   │                    │                       │                      │
   │                    │                       │──INSERT INTO────────▶│
   │                    │                       │                      │
   │                    │                       │◀────New ID──────────│
   │                    │                       │                      │
   │                    │◀──201 Created────────│                      │
   │                    │  {id, author, text... }                     │
   │                    │                       │                      │
   │◀─Add to UI────────│                       │                      │
```

### 3. PATCH Update Comment

```
Browser              Frontend                Backend                Database
   │                    │                       │                      │
   │──Edit & Save──────▶│                       │                      │
   │                    │                       │                      │
   │                    │─PATCH /api/comments/1/│                      │
   │                    │  {"text": "updated"}  │                      │
   │                    │                       │                      │
   │                    │                       │──UPDATE SET text─────▶│
   │                    │                       │  WHERE id=1          │
   │                    │                       │                      │
   │                    │                       │◀────Success─────────│
   │                    │                       │                      │
   │                    │◀──200 OK─────────────│                      │
   │                    │  {id, author, text... }                     │
   │                    │                       │                      │
   │◀─Update UI────────│                       │                      │
```

### 4. DELETE Comment

```
Browser              Frontend                Backend                Database
   │                    │                       │                      │
   │──Click Delete─────▶│                       │                      │
   │◀─Confirm?─────────│                       │                      │
   │──Yes──────────────▶│                       │                      │
   │                    │                       │                      │
   │                    │─DELETE /api/comments/1/                     │
   │                    │                       │                      │
   │                    │                       │──DELETE FROM────────▶│
   │                    │                       │  WHERE id=1          │
   │                    │                       │                      │
   │                    │                       │◀────Success─────────│
   │                    │                       │                      │
   │                    │◀──204 No Content─────│                      │
   │                    │                       │                      │
   │◀─Remove from UI───│                       │                      │
```

## Component Hierarchy

```
App
 └── CommentList (Smart Component)
      ├── State Management
      │   ├── comments[]
      │   ├── loading
      │   ├── error
      │   └── newCommentText
      │
      ├── API Calls
      │   ├── fetchComments()
      │   ├── handleAddComment()
      │   ├── handleUpdateComment()
      │   └── handleDeleteComment()
      │
      └── Render
           ├── Header
           ├── Error Banner (conditional)
           ├── Add Comment Form
           └── Comments List
                └── Comment × N (Dumb Component)
                     ├── Props
                     │   ├── comment
                     │   ├── onUpdate
                     │   └── onDelete
                     │
                     ├── Local State
                     │   ├── isEditing
                     │   └── editText
                     │
                     └── Render
                          ├── Avatar
                          ├── Author & Date
                          ├── Text (or Edit Form)
                          ├── Likes
                          └── Action Buttons
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     State Management                         │
└─────────────────────────────────────────────────────────────┘

User Action → Component Handler → API Call → Backend Processing
     │              │                │              │
     │              │                │              ├─ Validate
     │              │                │              ├─ Process
     │              │                │              └─ Database
     │              │                │
     │              │                ├─ Success Response
     │              │                └─ Error Response
     │              │
     │              ├─ Update State (comments array)
     │              └─ Handle Errors
     │
     └─ UI Re-renders (React)

Example: Adding a Comment
─────────────────────────
1. User types text and clicks "Post Comment"
2. CommentList.handleAddComment() is called
3. commentAPI.createComment(text) makes HTTP POST
4. Django receives request
5. ViewSet.create() validates and saves
6. Database INSERT new row
7. Django returns 201 + new comment JSON
8. Frontend receives response
9. setState adds new comment to array
10. React re-renders with new comment visible
```

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │  React Components
│         (User Interface)                 │  CSS Styling
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Application Layer                │  State Management
│      (Business Logic - Frontend)         │  Event Handlers
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Communication Layer              │  Axios (HTTP Client)
│         (API Client)                     │  JSON Serialization
└──────────────┬──────────────────────────┘
               │
               │  HTTP/REST
               │
┌──────────────▼──────────────────────────┐
│         API Layer                        │  URL Routing
│      (REST Framework)                    │  ViewSets
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Business Logic Layer             │  Serializers
│         (Backend Processing)             │  Validation
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Data Access Layer                │  Django ORM
│         (Models)                         │  QuerySets
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Data Layer                       │  SQLite/PostgreSQL
│         (Database)                       │  SQL
└─────────────────────────────────────────┘
```

## Security Considerations

```
┌─────────────────────────────────────────┐
│         Frontend                         │
│  - Input validation (client-side)       │
│  - XSS prevention (React escaping)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Transport                        │
│  - CORS headers (controlled origins)    │
│  - HTTPS (in production)                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Backend                          │
│  - Input validation (serializers)       │
│  - SQL injection prevention (ORM)       │
│  - CSRF protection (Django)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Database                         │
│  - Parameterized queries (ORM)          │
│  - Data integrity constraints           │
└─────────────────────────────────────────┘
```

## Scalability Path

### Current (Development)
- Single server (Django + SQLite)
- Single instance (Vite dev server)

### Production Ready
```
┌──────────────────┐
│   Load Balancer  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ Web 1 │ │ Web 2 │  (React build served by nginx)
└───────┘ └───────┘
         │
┌────────▼─────────┐
│  API Server(s)   │  (Django + Gunicorn)
└────────┬─────────┘
         │
┌────────▼─────────┐
│   PostgreSQL     │  (Primary + Replicas)
└──────────────────┘
```

### Future Enhancements
- Redis for caching
- CDN for static assets
- WebSocket for real-time
- Elasticsearch for search
- S3 for media files
