# Development Setup Guide

## Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB (local or Atlas)
- Git
- Text editor (VS Code recommended)

## Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/CodeAlpha_Real-Time-Communication-App.git
cd CodeAlpha_Real-Time-Communication-App
```

## Step 2: Setup Backend

### Install Dependencies
```bash
cd server
npm install
```

### Environment Setup
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rtc_app
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
ENCRYPTION_KEY=your_encryption_key_32_chars_long!
```

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

**Option 2: MongoDB Atlas**
- Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Copy connection string to `MONGODB_URI` in `.env`

### Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Step 3: Setup Frontend

### Install Dependencies
```bash
cd ../client
npm install
```

### Environment Setup
```bash
# Copy example env file
cp .env.example .env

# Edit .env:
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Start Development Server
```bash
npm run dev
```

The client will start on `http://localhost:5173`

## Step 4: Verify Setup

1. Open browser: `http://localhost:5173`
2. Create a test account
3. Open another browser tab/window in private mode
4. Create another test account
5. Test calling between accounts

## Development Workflow

### Common Commands

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
npm run lint     # Run ESLint
```

**Backend:**
```bash
npm run dev      # Start with auto-reload
npm start        # Start production server
npm run lint     # Run ESLint
```

### File Structure Best Practices

- Controllers: Business logic per route
- Services: Reusable business logic
- Models: Database schemas
- Middleware: Request processing
- Utils: Helper functions
- Components: UI components
- Pages: Full page components
- Store: State management

### Code Style

- Use ES6+ features
- Follow DRY principle
- Add comments for complex logic
- Use meaningful variable names
- Keep functions small and focused

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Describe your changes"

# Push and create PR
git push origin feature/your-feature-name
```

## Debugging

### Browser DevTools
- Open DevTools (F12)
- Check Console for errors
- Use Network tab for API calls
- Use Performance tab for optimization

### Backend Debugging
- Check server logs in terminal
- Use `console.log` for debugging
- Use Node debugger: `node --inspect src/server.js`

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
# macOS/Linux
lsof -i :5000

# Windows
netstat -ano | findstr :5000

# Kill process
# macOS/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network access in MongoDB Atlas

### CORS Errors
- Check CORS_ORIGIN in server .env
- Ensure frontend URL matches

### WebRTC Connection Issues
- Check browser WebRTC permissions
- Try STUN servers
- Check firewall settings

## Performance Tips

1. **Frontend:**
   - Use React DevTools Profiler
   - Lazy load large components
   - Optimize images
   - Use code splitting

2. **Backend:**
   - Add database indexes
   - Use query pagination
   - Monitor memory usage
   - Use caching where appropriate

## Next Steps

1. Read [API Documentation](./API.md)
2. Read [Architecture Doc](./ARCHITECTURE.md)
3. Check out the main [README](../README.md)
4. Start developing features!

## Getting Help

- Check GitHub Issues
- Read documentation
- Ask in community channels
- Submit detailed bug reports

Happy coding! 🚀
