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

# 2. Core Actors
## Student
- Login
- View notifications
- Filter notifications
- Mark read/unread
- Mark all read
- Delete/archive
- Manage preferences
- Receive real-time notifications

## Admin / Placement Cell / Event Team
- Create notifications
- Schedule notifications
- Send bulk notifications
- Prioritize notifications
- Track delivery

---

# 3. Notification Types
- Placement
- Event
- Result

---

# 4. Notification Priority Model
Priority determines inbox ranking:
- Placement = 10
- Result = 8
- Event = 5

Priority can also be manually overridden for urgent alerts.

---

# 5. Authentication APIs

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

# 6. Student Notification APIs

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

# 7. Preferences APIs

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

# 8. Admin Notification APIs

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

# 9. Standard Notification Object Schema

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

# 10. Real-Time Notification Mechanism

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

# 11. Notification Lifecycle
Admin Creates → Validation → Queue → Delivery Engine → Student Inbox → Read/Unread → Archive/Expire

---

# 12. Security Design
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

# 13. Pagination Strategy
Cursor or page-limit:
- Default limit = 20
- Max limit = 100

---

# 14. Error Response Format
{
  "success": false,
  "errorCode": "INVALID_TOKEN",
  "message": "Authentication failed"
}

---

# 15. Status Codes
- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 429 Too Many Requests
- 500 Internal Server Error

---

# 16. Scalability Considerations
- WebSocket gateway
- Notification queue (Kafka/RabbitMQ)
- Redis for unread counters
- DB sharding by studentId
- CDN for static assets
- Async delivery workers

---

# 17. Naming Standards
- /api/v1
- plural nouns
- UUID IDs
- PATCH for partial updates
- RESTful predictable contracts

---

# 18. Future Extensions
- Priority Inbox
- AI categorization
- Digest emails
- Notification snooze
- Multi-language support