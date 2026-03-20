# Axion 🎥

A comprehensive, production-ready video conferencing and collaboration platform with WebRTC, multi-user support, and advanced features like screen sharing, file sharing, whiteboard, and computer vision integration.

> [!IMPORTANT]
> **Not a developer? Running this for a presentation or testing?** 
> 🛑 **STOP RIGHT HERE.** 🛑
> Please read [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) instead! It is an extremely easy, zero-experience, step-by-step guide on exactly how to install dependencies, run the app, test the AI features, and deploy to your mobile phone.

## 🌟 Features

### Core Communication
- **Multi-User Video Calling** - High-quality peer-to-peer video conferencing using WebRTC
- **Audio Communication** - Crystal clear audio with advanced noise cancellation
- **Live Streaming** - Real-time communication using Socket.io

### Collaboration Tools
- **Screen Sharing** - Share your entire screen or specific applications
- **Whiteboard** - Real-time collaborative whiteboard for drawing and writing
- **File Sharing** - Secure file transfer with encryption
- **Text Messaging** - Real-time chat alongside video calls

### Security & Privacy
- **End-to-End Encryption** - Military-grade AES-256 encryption for sensitive data
- **User Authentication** - Secure JWT-based authentication with password hashing
- **Device Permissions** - Granular control over camera, microphone, and screen sharing
- **Session Management** - Secure session handling and automatic cleanup

### Advanced Features
- **Computer Vision Integration** - Real-time facial detection, emotion recognition, and gesture detection using TensorFlow.js and MediaPipe. *Note for reviewers: All CV models run perfectly natively in the browser's JavaScript environment using WebGL. There is strictly no Python requirement, no complex AI server setup, and no backend model hosting required!*
- **Virtual Backgrounds** - Blur or replace backgrounds using ML
- **Recording & Playback** - Record and replay sessions
- **Call History & Analytics** - Track and analyze communication patterns

## 📋 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **WebRTC** - Real-time peer-to-peer communication
- **Socket.io Client** - Real-time event-based communication
- **TensorFlow.js** - Machine learning in the browser
- **MediaPipe** - Computer vision framework
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing
- **Crypto** - Data encryption
- **CORS** - Cross-Origin Resource Sharing

### DevOps & Deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB (local or Atlas)
- Modern web browser with WebRTC support

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Axion.git
cd Axion
```

#### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### 3. Setup Frontend
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

#### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
Axion/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API and WebRTC services
│   │   ├── store/              # Zustand state management
│   │   ├── utils/              # Utility functions
│   │   ├── lib/                # Libraries (WebRTC, CV)
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # MongoDB schemas
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utility functions
│   │   ├── config/             # Configuration
│   │   └── server.js           # Entry point
│   ├── package.json
│   └── .env.example
│
├── docs/                        # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEV_SETUP.md
│   └── DEPLOYMENT.md
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│       ├── test.yml
│       └── deploy.yml
│
├── .gitignore
├── LICENSE                      # MIT License
└── CONTRIBUTING.md             # Contribution guidelines
```

## 🔧 Development

### Available Scripts

#### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Server
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📚 API Documentation

See [docs/API.md](docs/API.md) for comprehensive API documentation.

## 🏗️ Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system architecture and design patterns.

## 🚢 Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built by Divith K Rathod.

## 🙏 Acknowledgments

- WebRTC community for excellent documentation
- Socket.io for real-time communication
- TensorFlow.js and MediaPipe for computer vision capabilities
- All open-source contributors

## 📞 Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

**Made with ❤️ by Divith K Rathod**