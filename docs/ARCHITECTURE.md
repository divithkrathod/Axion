# Architecture

## System Overview

Axion is a full-stack application built with modern technologies for real-time video conferencing and collaboration.

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Zustand** - State management
- **Socket.io Client** - Real-time events
- **WebRTC** - Peer-to-peer communication
- **TensorFlow.js + MediaPipe** - Computer vision
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Crypto** - Encryption

## Architecture Layers

### 1. Presentation Layer (Frontend)
```
/client/src
├── pages/          # Page components
├── components/     # Reusable components
├── services/       # API and Socket services
├── store/          # Zustand state management
├── lib/            # Libraries (WebRTC, CV)
└── utils/          # Utility functions
```

### 2. Application Layer (Backend)
```
/server/src
├── routes/         # API endpoints
├── controllers/    # Business logic
├── middleware/     # Authentication, error handling
├── models/         # Database schemas
├── services/       # Business logic services
├── sockets/        # WebSocket handlers
└── utils/          # Utilities (encryption, JWT)
```

### 3. Data Layer (Database)
- **MongoDB** with collections:
  - Users
  - Messages
  - Calls

## Data Flow

### Authentication Flow
1. User registers/logs in via frontend
2. Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in API requests
6. Backend validates token for authenticated routes

### Real-Time Communication Flow
1. Users connect via Socket.io
2. Frontend initiates WebRTC peer connection
3. Server facilitates signaling (offer/answer)
4. Peers exchange ICE candidates
5. Direct P2P connection established
6. Media streams flow between peers

### Message Flow
1. User sends message via Socket.io
2. Backend encrypts and saves to database
3. Backend emits to recipient via Socket.io
4. Frontend displays received message

## Security

### Authentication & Authorization
- JWT-based authentication
- Passwords hashed with bcryptjs
- Token validation on protected routes
- Session management

### Data Encryption
- End-to-end encryption for messages (AES-256)
- Data encrypted at rest in database
- HTTPS in production

### Privacy
- User privacy settings (public/friends/private)
- Message deletion for users
- Call logs isolated per user

## Scalability Considerations

### Current Architecture
- Single server instance
- MongoDB for data persistence
- In-memory user socket mapping

### Future Improvements
- Load balancing with multiple server instances
- Redis for state management
- Database replication and sharding
- CDN for static assets
- Media server for recording/transcoding

## Component Responsibilities

### Frontend Components
- **App** - Main router and auth handler
- **LoginPage** - User authentication
- **SignupPage** - User registration
- **DashboardPage** - Main interface
- **CallPage** - Video conferencing
- **VideoSection** - Call management
- **ChatSection** - Messaging
- **Sidebar** - Navigation

### Backend Controllers
- **AuthController** - Authentication logic
- **UserController** - User profile management
- **CallController** - Call lifecycle management
- **MessageController** - Message handling

### Services
- **WebRTCManager** - Peer connection management
- **ComputerVision** - Face detection, emotion recognition
- **API Client** - HTTP requests to backend
- **Socket Service** - Real-time communication

## Error Handling

### Frontend
- Try-catch blocks for async operations
- User-friendly error messages
- Fallback UI states

### Backend
- Custom error middleware
- Proper HTTP status codes
- Detailed error logging

## Performance Optimizations

### Frontend
- Lazy loading of components
- Memoization of expensive computations
- Efficient re-renders with Zustand
- Image optimization

### Backend
- Database indexing
- Efficient queries with pagination
- Compression middleware
- Connection pooling

## Deployment

See `DEPLOYMENT.md` for production deployment instructions.
