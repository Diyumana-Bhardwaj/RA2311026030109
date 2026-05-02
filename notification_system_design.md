# Campus Notification System Design

# Stage 1: REST API Design, Contracts & Real-Time Notification Architecture

## 1. Objective
Design a scalable campus notification backend platform that delivers real-time updates for:
- Placements
- Events
- Results

The system should support:
- Secure student authentication
- Real-time in-app notifications
- Push/email fallback
- Notification filtering, pagination, unread tracking
- Preferences management
- Admin publishing workflows

---

## 2. Core Actors
### Student
- Login
- View notifications
- Filter notifications
- Mark read/unread
- Mark all read
- Delete/archive
- Manage preferences
- Receive real-time notifications

### Admin / Placement Cell / Event Team
- Create notifications
- Schedule notifications
- Send bulk notifications
- Prioritize notifications
- Track delivery

---

## 3. Notification Types
- Placement
- Event
- Result

---

## 4. Notification Priority Model
Priority determines inbox ranking:
- Placement = 10
- Result = 8
- Event = 5

Priority can also be manually overridden for urgent alerts.

---

## 5. Authentication APIs

## POST /api/v1/auth/login

### Headers
Content-Type: application/json

### Request
{
  "email": "student@college.edu",
  "password": "password123"
}

### Response (200)
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "studentId": "1042",
  "expiresIn": 3600
}

### Errors
401 Unauthorized
400 Invalid Credentials

---

## POST /api/v1/auth/refresh

### Request
{
  "refreshToken": "refresh_token"
}

### Response
{
  "token": "new_jwt_token"
}

---

## POST /api/v1/auth/logout

### Headers
Authorization: Bearer <token>

### Response
{
  "success": true
}

---

## 6. Student Notification APIs

## GET /api/v1/notifications

### Headers
Authorization: Bearer <token>

### Query Params
- page=1
- limit=20
- type=Placement|Event|Result
- unreadOnly=true|false
- priorityMin=1
- sort=latest|priority

### Response
{
  "page": 1,
  "limit": 20,
  "total": 240,
  "notifications": [
    {
      "id": "uuid",
      "studentId": "1042",
      "type": "Placement",
      "title": "Amazon Hiring Challenge",
      "message": "Apply before midnight",
      "priority": 10,
      "deliveryChannels": ["in_app", "push"],
      "isRead": false,
      "createdAt": "2026-04-22T18:00:00Z",
      "expiresAt": "2026-04-25T00:00:00Z"
    }
  ]
}

---

## GET /api/v1/notifications/unread-count

### Response
{
  "unreadCount": 18
}

---

## GET /api/v1/notifications/{id}

### Response
{
  "id": "uuid",
  "type": "Result",
  "title": "Mid Sem Result",
  "message": "Results published",
  "isRead": true
}

---

## PATCH /api/v1/notifications/{id}/read

### Response
{
  "success": true,
  "message": "Notification marked as read"
}

---

## PATCH /api/v1/notifications/read-all

### Response
{
  "success": true,
  "updatedCount": 52
}

---

## DELETE /api/v1/notifications/{id}

### Response
{
  "success": true,
  "message": "Notification archived"
}

---

## POST /api/v1/notifications/bulk-action

### Request
{
  "action": "archive",
  "notificationIds": ["id1", "id2", "id3"]
}

### Response
{
  "success": true,
  "processedCount": 3
}

---

## 7. Preferences APIs

## GET /api/v1/preferences

### Response
{
  "placement": true,
  "events": true,
  "results": true,
  "emailEnabled": true,
  "pushEnabled": true
}

---

## PUT /api/v1/preferences

### Request
{
  "placement": true,
  "events": false,
  "results": true,
  "emailEnabled": true,
  "pushEnabled": true
}

### Response
{
  "success": true
}

---

## 8. Admin Notification APIs

## POST /api/v1/admin/notifications

### Headers
Authorization: Bearer <admin_token>

### Request
{
  "targetAudience": "all_students",
  "type": "Placement",
  "title": "Google Internship 2026",
  "message": "Applications close Friday",
  "priority": 10,
  "deliveryChannels": ["in_app", "push", "email"],
  "scheduledAt": null
}

### Response
{
  "success": true,
  "notificationId": "uuid"
}

---

## POST /api/v1/admin/notifications/bulk

### Request
{
  "studentIds": ["1042", "1043"],
  "type": "Result",
  "message": "Your semester result is published"
}

---

## 9. Standard Notification Object Schema

{
  "id": "uuid",
  "studentId": "1042",
  "type": "Placement",
  "title": "Amazon Hiring Challenge",
  "message": "Apply before midnight",
  "priority": 10,
  "deliveryChannels": [
    "in_app",
    "push",
    "email"
  ],
  "isRead": false,
  "createdBy": "admin_uuid",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE",
  "expiresAt": "ISO_DATE"
}

---

## 10. Real-Time Notification Mechanism

## Primary:
WebSocket

### Endpoint:
wss://api.college.edu/ws/notifications

### Connection Flow:
1. Student logs in
2. JWT token validated
3. WebSocket connection established
4. Backend pushes notifications instantly

### Example Event Payload:
{
  "event": "NEW_NOTIFICATION",
  "data": {
    "id": "uuid",
    "type": "Placement",
    "title": "Microsoft Hiring",
    "message": "Apply now",
    "priority": 10
  }
}

---

## Secondary:
- Firebase Cloud Messaging (Android/Web)
- APNs (iOS)
- Email fallback
- SMS for critical alerts

---

## 11. Notification Lifecycle
Admin Creates → Validation → Queue → Delivery Engine → Student Inbox → Read/Unread → Archive/Expire

---

## 12. Security Design
- JWT Access Tokens
- Refresh Tokens
- Role-Based Access Control
- HTTPS only
- Rate Limiting
- Input Validation
- Audit Logging
- Token Expiry
- Admin-only publishing APIs

---

## 13. Pagination Strategy
Cursor or page-limit:
- Default limit = 20
- Max limit = 100

---

## 14. Error Response Format
{
  "success": false,
  "errorCode": "INVALID_TOKEN",
  "message": "Authentication failed"
}

---

## 15. Status Codes
- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 429 Too Many Requests
- 500 Internal Server Error

---

## 16. Scalability Considerations
- WebSocket gateway
- Notification queue (Kafka/RabbitMQ)
- Redis for unread counters
- DB sharding by studentId
- CDN for static assets
- Async delivery workers

---

## 17. Naming Standards
- /api/v1
- plural nouns
- UUID IDs
- PATCH for partial updates
- RESTful predictable contracts

---

## 18. Future Extensions
- Priority Inbox
- AI categorization
- Digest emails
- Notification snooze
- Multi-language support

# Stage 2: Database Schema Design & Storage Architecture

## Objective
Design a scalable database architecture to support:
- Student authentication
- Notification creation
- Notification delivery
- Read/unread tracking
- Preferences
- Admin publishing
- Multi-channel delivery
- High-volume scalability

---

# 1. Core Database Choice

## Recommended:
### Primary DB:
PostgreSQL / MySQL (Relational)

### Why:
- Structured relationships
- ACID compliance
- JWT/user mapping
- Admin/student permissions
- Filtering + joins

---

## Supporting Systems:
### Redis:
- Unread count cache
- Session/token blacklist
- Real-time pub/sub

### Kafka / RabbitMQ:
- Notification queue
- Async push/email processing

---

# 2. Main Entities

## Tables:
1. students
2. admins
3. notifications
4. student_notifications
5. notification_preferences
6. delivery_logs
7. auth_sessions

---

# 3. students Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE |
| password_hash | TEXT | NOT NULL |
| department | VARCHAR(50) | |
| year | INT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

# 4. admins Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | |
| email | VARCHAR(255) | UNIQUE |
| password_hash | TEXT | |
| role | ENUM('placement','event','result','super_admin') | |
| created_at | TIMESTAMP | |

---

# 5. notifications Table
Stores master notification object

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| type | ENUM('Placement','Event','Result') | INDEX |
| title | VARCHAR(255) | |
| message | TEXT | |
| priority | INT | |
| created_by | UUID | FK -> admins.id |
| target_audience | VARCHAR(100) | |
| scheduled_at | TIMESTAMP NULL | |
| expires_at | TIMESTAMP NULL | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

# 6. student_notifications Table
Tracks per-student delivery + read status

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| student_id | UUID | FK -> students.id |
| notification_id | UUID | FK -> notifications.id |
| is_read | BOOLEAN | DEFAULT FALSE |
| read_at | TIMESTAMP NULL | |
| is_archived | BOOLEAN | DEFAULT FALSE |
| delivery_status | ENUM('pending','sent','failed') | |
| created_at | TIMESTAMP | |

---

# Why separate table?
Because one notification may go to:
```txt id="v3p7la"
1 notification → thousands of students

# Stage 3: Backend Implementation, Service Architecture & Execution Workflow

## Objective
Convert the Stage 1 API contracts and Stage 2 DB schema into an implementation-ready backend architecture for:
- Secure authentication
- Notification publishing
- Student inbox
- Real-time delivery
- Multi-channel messaging
- Horizontal scalability

---

# 1. Recommended Technology Stack

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL / MySQL

## Cache
- Redis

## Queue
- RabbitMQ / Kafka

## Real-Time
- WebSocket (Socket.IO / ws)

## Push
- Firebase Cloud Messaging (FCM)
- Apple Push Notification Service (APNs)

## Email
- SMTP / SendGrid

---

# 2. Backend Project Structure

notification_app_be/
│── package.json
│── app.js
│
├── config/
│   ├── db.js
│   ├── redis.js
│   ├── websocket.js
│   └── queue.js
│
├── routes/
│   ├── authRoutes.js
│   ├── notificationRoutes.js
│   ├── preferenceRoutes.js
│   └── adminRoutes.js
│
├── controllers/
│   ├── authController.js
│   ├── notificationController.js
│   ├── preferenceController.js
│   └── adminController.js
│
├── services/
│   ├── authService.js
│   ├── notificationService.js
│   ├── deliveryService.js
│   ├── emailService.js
│   └── pushService.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorMiddleware.js
│   └── loggerMiddleware.js
│
├── models/
│   ├── Student.js
│   ├── Notification.js
│   ├── StudentNotification.js
│   └── Preference.js
│
└── workers/
    ├── pushWorker.js
    ├── emailWorker.js
    └── cleanupWorker.js

---

# 3. Application Entry Point

## app.js Responsibilities
- Express init
- Middleware registration
- Route mounting
- JWT auth
- Logging middleware
- WebSocket init
- Error handling
- DB + Redis connection

---

# 4. Request Lifecycle

## Student Login
Client →
POST /auth/login →
authController →
authService →
DB validation →
JWT generation →
Response

---

## Fetch Notifications
Client →
authMiddleware →
notificationController →
notificationService →
Redis cache check →
DB fallback →
Response

---

## Admin Publishes Notification
Admin →
adminController →
Validation →
notifications table insert →
Target student resolution →
student_notifications bulk insert →
Queue publish →
Workers →
WebSocket / Push / Email

---

# 5. Notification Delivery Pipeline

## Flow:
1. Notification created
2. Stored in DB
3. Eligible students selected
4. Queue event generated
5. Redis pub/sub pushes live sessions
6. Push worker sends mobile push
7. Email worker sends fallback
8. delivery_logs updated
9. Retry failures

---

# 6. Real-Time Architecture

## WebSocket Flow
1. Student authenticates
2. WebSocket JWT handshake
3. Socket joins room:
student:{studentId}

## Example:
student:1042

4. On notification:
- Individual room push
- Department broadcast
- Global broadcast

---

## Event:
NEW_NOTIFICATION

### Payload:
{
  "id": "uuid",
  "type": "Placement",
  "title": "Google Internship",
  "message": "Apply before Friday",
  "priority": 10
}

---

# 7. Redis Usage
## Use Cases:
- JWT blacklist
- Session cache
- Notification cache
- Unread counts
- WebSocket pub/sub

---

# 8. Queue Usage
## RabbitMQ/Kafka:
### Queues:
- notification_push_queue
- notification_email_queue
- cleanup_queue

---

# 9. Security Middleware

## authMiddleware
- JWT verify
- Expiry check
- Token blacklist check

## roleMiddleware
- Student
- Admin
- Placement admin
- Super admin

---

# 10. Logging Integration
Use previously built logging middleware:
```txt id="v3p7la"
Log("backend", "info", "controller", "Notification fetched")

# Stage 4: Frontend Architecture, User Experience Design & Client-Side Notification Handling

## Objective
Design a responsive frontend system for students and admins to:
- Authenticate securely
- View notifications
- Receive real-time updates
- Filter and manage notifications
- Configure preferences
- Publish notifications (admin)
- Support web + mobile scalability

---

# 1. Frontend Platforms

## Student:
- Web App (React.js / Next.js)
- Mobile App (React Native / Flutter)

## Admin:
- Web Dashboard

---

# 2. Recommended Frontend Tech Stack

## Web:
- React.js / Next.js
- Tailwind CSS
- Redux Toolkit / Zustand
- Axios
- Socket.IO Client

## Mobile:
- React Native / Flutter
- Push Notifications (FCM/APNs)

---

# 3. Frontend Folder Structure

notification_app_fe/
│── public/
│── src/
│   ├── pages/
│   │   ├── LoginPage
│   │   ├── DashboardPage
│   │   ├── NotificationsPage
│   │   ├── PreferencesPage
│   │   └── AdminDashboardPage
│   │
│   ├── components/
│   │   ├── Navbar
│   │   ├── NotificationCard
│   │   ├── NotificationFilter
│   │   ├── UnreadBadge
│   │   └── Loader
│   │
│   ├── hooks/
│   │   ├── useAuth
│   │   ├── useNotifications
│   │   └── useWebSocket
│   │
│   ├── state/
│   │   ├── authStore
│   │   ├── notificationStore
│   │   └── preferenceStore
│   │
│   ├── api/
│   │   ├── authApi
│   │   ├── notificationApi
│   │   └── preferenceApi
│   │
│   └── utils/
│       ├── tokenManager
│       └── formatters

---

# 4. Core UI Screens

## Student Screens
### Login Page
- Email/password
- JWT token handling
- Session persistence

---

### Dashboard
- Unread count
- Priority notifications
- Recent notifications
- Category quick filters

---

### Notifications Page
- Infinite scroll / pagination
- Filter:
  - Placement
  - Event
  - Result
- Sort:
  - Latest
  - Priority
- Mark read
- Mark all read
- Archive

---

### Preferences Page
- Placement toggle
- Event toggle
- Result toggle
- Push toggle
- Email toggle

---

## Admin Dashboard
- Create notification
- Schedule notification
- Target audience
- Delivery analytics

---

# 5. Authentication Flow

Login →
JWT stored securely →
Refresh token flow →
Protected routes →
Auto logout on expiry

---

# 6. Token Storage
## Web:
- HttpOnly cookies preferred
- LocalStorage fallback (less secure)

## Mobile:
- Secure storage / Keychain

---

# 7. Real-Time Notification Flow

1. User logs in
2. WebSocket connects
3. Subscribe to student room
4. New notification event received
5. UI updates instantly
6. Badge count increments
7. Toast/banner displayed

---

# Example:
Placement drive arrives →
Instant popup →
Notification inserted at top

---

# 8. UI State Management

## authStore:
- token
- user
- role

## notificationStore:
- notifications
- unreadCount
- filters
- loading state

## preferenceStore:
- category preferences
- delivery settings

---

# 9. Notification Card Design
## Fields:
- Title
- Message
- Type badge
- Priority badge
- Timestamp
- Read/unread indicator
- Action buttons

---

# 10. UX Priorities
- Fast load
- Mobile responsive
- Offline caching
- Push notifications
- Accessibility
- Dark mode
- Search

---

# 11. Error Handling
- Token expired
- Network failure
- WebSocket disconnect
- Retry banner
- Empty state
- Rate limit warning

---

# 12. Performance Optimization
- Lazy loading
- Pagination
- Virtualized lists
- Debounced search
- Redis-backed fast APIs
- Optimistic UI updates

---

# 13. Security
- Protected routes
- Role guards
- XSS prevention
- CSRF protection
- Token refresh
- Secure logout

---

# 14. Admin Publishing Flow
Admin Dashboard →
Form validation →
POST /admin/notifications →
Preview →
Publish →
Delivery analytics

---

# 15. Accessibility
- Keyboard navigation
- Screen reader labels
- High contrast mode
- Responsive layouts

---

# 16. Push Notification UX
## Foreground:
Toast + live insert

## Background:
Push notification

## Offline:
Push + email fallback

---

# 17. Analytics
Track:
- Open rate
- Click rate
- Read rate
- Category engagement
- Delivery latency

---

# 18. Future Enhancements
- AI-priority inbox
- Snooze notifications
- Smart grouping
- Calendar sync
- Placement tracker
- Resume reminders