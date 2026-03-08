# 🚀 Quick Start Guide

## Real-Time Communication App - Setup & Run

### Prerequisites
- Node.js v16+ and npm v7+
- MongoDB (local or Atlas)
- Git

### Installation & Setup

#### 1. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and port
# Example:
# MONGODB_URI=mongodb://localhost:27017/realtime-comm
# PORT=5000
# JWT_SECRET=your_jwt_secret_key

# Start the server
npm run dev
```

#### 2. Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your API endpoint
# Example:
# VITE_API_URL=http://localhost:5000
# VITE_SOCKET_URL=http://localhost:5000

# Start development server
npm run dev
```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **WebSocket**: ws://localhost:5000

### Default Test Account (If seeded)
- **Email**: test@example.com
- **Password**: Test@123

### Key Features

✅ **Real-Time Video Calling** - WebRTC peer-to-peer video/audio
✅ **Instant Messaging** - End-to-end encrypted messages with Socket.io
✅ **Computer Vision** - Face detection, emotion recognition, gesture detection
✅ **File Sharing** - Share files during calls
✅ **Screen Sharing** - Share screen with peers
✅ **User Authentication** - JWT-based secure authentication
✅ **Dark Theme** - Beautiful dark aesthetic UI
✅ **Online Status** - Real-time user presence tracking

### Development Commands

**Backend:**
```bash
npm run dev      # Start with nodemon
npm run build    # Build for production
npm start        # Start production server
```

**Frontend:**
```bash
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Troubleshooting

**Cannot connect to MongoDB:**
- Ensure MongoDB service is running
- Check connection string in .env
- Verify database name matches

**WebRTC not working:**
- Check browser microphone/camera permissions
- Ensure both peers are connected via Socket.io
- Check firewall settings

**Frontend won't connect to backend:**
- Verify backend is running on port 5000
- Check VITE_API_URL in .env
- Clear browser cache and restart dev server

### Documentation

- [API Documentation](./docs/API.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Setup](./docs/DEV_SETUP.md)

### Technologies Used

- **Backend**: Node.js, Express, MongoDB, Socket.io, WebRTC
- **Frontend**: React, Vite, Zustand, Tailwind CSS, TensorFlow.js
- **Real-time**: Socket.io, WebRTC (simple-peer)
- **Computer Vision**: TensorFlow.js, MediaPipe
- **Security**: JWT, bcryptjs, AES-256 Encryption

### Next Steps

1. Read the [Development Setup Guide](./docs/DEV_SETUP.md) for detailed configuration
2. Check [API Documentation](./docs/API.md) for available endpoints
3. Review [Architecture](./docs/ARCHITECTURE.md) for system design
4. Read [Contributing Guidelines](./CONTRIBUTING.md) for contribution standards

### Support

For issues or questions:
- Check existing documentation
- Review code comments
- Check browser console for errors
- Verify all services are running

---

**Happy coding! 🎉**
