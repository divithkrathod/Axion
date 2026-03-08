# API Documentation

This document describes all available API endpoints for the Real-Time Communication App.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All requests (except auth endpoints) require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "fullName": "string"
  }
  ```
- **Response:** `{ success: true, token: "string", user: {...} }`

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** `{ success: true, token: "string", user: {...} }`

#### Logout
- **POST** `/auth/logout`
- **Response:** `{ success: true, message: "Logged out successfully" }`

#### Validate Token
- **GET** `/auth/validate`
- **Response:** `{ success: true, user: {...} }`

### Users

#### Get User Profile
- **GET** `/users/profile/:userId`
- **Response:** `{ success: true, user: {...} }`

#### Update Profile
- **PUT** `/users/profile`
- **Body:**
  ```json
  {
    "fullName": "string",
    "avatar": "string",
    "bio": "string",
    "status": "available|busy|offline"
  }
  ```
- **Response:** `{ success: true, user: {...} }`

#### Search Users
- **GET** `/users/search?query=string&limit=20`
- **Response:** `{ success: true, users: [...] }`

#### Get Online Users
- **GET** `/users/online`
- **Response:** `{ success: true, users: [...] }`

#### Update Settings
- **PUT** `/users/settings`
- **Body:**
  ```json
  {
    "notificationsEnabled": boolean,
    "privacyLevel": "public|friends|private"
  }
  ```
- **Response:** `{ success: true, user: {...} }`

### Calls

#### Initiate Call
- **POST** `/calls/initiate`
- **Body:**
  ```json
  {
    "recipientId": "string",
    "callType": "audio|video|group"
  }
  ```
- **Response:** `{ success: true, call: {...}, roomId: "string" }`

#### End Call
- **PUT** `/calls/:callId/end`
- **Response:** `{ success: true, message: "Call ended", call: {...} }`

#### Get Call Details
- **GET** `/calls/:callId`
- **Response:** `{ success: true, call: {...} }`

#### Get Call History
- **GET** `/calls?limit=50&skip=0`
- **Response:** `{ success: true, calls: [...], total: number }`

#### Update Call Status
- **PUT** `/calls/:callId/status`
- **Body:**
  ```json
  {
    "status": "ringing|ongoing|ended|missed|declined",
    "startTime": "timestamp"
  }
  ```
- **Response:** `{ success: true, call: {...} }`

#### Add Participant
- **POST** `/calls/:callId/participants`
- **Body:**
  ```json
  {
    "userId": "string"
  }
  ```
- **Response:** `{ success: true, call: {...} }`

### Messages

#### Send Message
- **POST** `/messages/send`
- **Body:**
  ```json
  {
    "recipientId": "string",
    "content": "string",
    "messageType": "text|file|system",
    "fileData": {...}
  }
  ```
- **Response:** `{ success: true, message: {...} }`

#### Get Messages
- **GET** `/messages?recipientId=string&limit=50&skip=0`
- **Response:** `{ success: true, messages: [...] }`

#### Mark as Read
- **PUT** `/messages/:messageId/read`
- **Response:** `{ success: true, message: {...} }`

#### Delete Message
- **DELETE** `/messages/:messageId`
- **Response:** `{ success: true, message: "Message deleted" }`

#### Get Conversations
- **GET** `/messages/conversations?limit=20&skip=0`
- **Response:** `{ success: true, conversations: [...] }`

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "status": 400-500,
  "message": "Error description"
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## Rate Limiting
Currently, there is no rate limiting. This will be implemented in production.

## WebSocket Events

See `docs/WEBSOCKET.md` for real-time communication events.
