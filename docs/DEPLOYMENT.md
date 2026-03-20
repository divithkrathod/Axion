# Deployment Guide

This guide covers deployment of Axion to production.

## 📱 Deploying on Mobile Phones (Local Demo)

If you are just presenting the app to a professor and want your teammate to access it on their mobile phone instantly:
1. Ensure both the PC running the app and the mobile phone are connected to the exact same Wi-Fi network.
2. Find your PC's local IP address (e.g. `192.168.1.5`).
3. Run the frontend with: `npm run dev -- --host`.
4. On the mobile phone browser, navigate to `http://192.168.1.5:5173`.
*(Note: Mobile browsers may block CV camera access on non-HTTPs local URLs. For a full demo with camera access, deploy using one of the cloud options below.)*

## Deployment Options

### Option 1: Heroku

#### Backend Deployment
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend-url.com

# Deploy
git push heroku main
```

#### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

### Option 2: Docker Deployment

#### Build Docker Image
```bash
# Create docker-compose.yml
docker-compose up -d

# Or build manually
docker build -t rtc-app .
docker run -p 5000:5000 rtc-app
```

#### Docker Compose File
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: rtc_app

  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/rtc_app
      PORT: 5000
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: http://localhost:3000
    depends_on:
      - mongodb

  app:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:5000/api
      VITE_SOCKET_URL: http://localhost:5000
```

### Option 3: AWS Deployment

#### EC2 Setup
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Clone repository
git clone your-repo-url
cd Axion

# Setup backend
cd server
npm install
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/rtc_app
JWT_SECRET=your-secret
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com" > .env

# Setup frontend
cd ../client
npm install
npm run build
echo "VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com" > .env.production

# Use PM2 for process management
npm install -g pm2
pm2 start "npm run start" --name "rtc-server"
pm2 save
pm2 startup
```

#### SSL Certificate (Let's Encrypt)
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

### Option 4: Azure App Service

```bash
# Install Azure CLI
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create -n rtc-rg -l eastus

# Create App Service plan
az appservice plan create -n rtc-plan -g rtc-rg --sku B1 --is-linux

# Deploy backend
az webapp create -n rtc-api -g rtc-rg -p rtc-plan --runtime "node|18-lts"

# Deploy frontend to Static Web Apps
az staticwebapp create -n rtc-app -g rtc-rg -s https://github.com/your-username/repo -b main --location eastus
```

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable logging and monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Set up rate limiting
- [ ] Enable GZIP compression
- [ ] Optimize database indexes
- [ ] Set up automated tests
- [ ] Configure CI/CD pipeline
- [ ] Monitor performance metrics
- [ ] Set up alerting
- [ ] Plan disaster recovery
- [ ] Complete security audit

## Environment Variables

### Backend
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-secret-key>
ENCRYPTION_KEY=<32-char-encryption-key>
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
        working-directory: ./server
      
      - name: Run tests
        run: npm test
        working-directory: ./server
      
      - name: Deploy
        run: npm run deploy
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
```

## Monitoring & Logging

### Recommended Services
- **Monitoring:** New Relic, Datadog, Azure Monitor
- **Logging:** Winston, Bunyan, ELK Stack
- **Error Tracking:** Sentry, Rollbar
- **Analytics:** Google Analytics, Mixpanel

## Performance Optimization

1. **Backend:**
   - Enable compression
   - Database query optimization
   - Caching layer (Redis)
   - Load balancing

2. **Frontend:**
   - Code splitting
   - Image optimization
   - Lazy loading
   - Caching strategy

## Security Hardening

1. **HTTPS/SSL** - Always use HTTPS
2. **Headers** - Set security headers (Helmet.js)
3. **Rate Limiting** - Prevent abuse
4. **Input Validation** - Validate all inputs
5. **SQL Injection** - Use parameterized queries
6. **CORS** - Configure properly
7. **Authentication** - Secure token handling

## Backup & Recovery

```bash
# MongoDB backup
mongodump --uri "mongodb://user:pass@host:port/database" --out ./backup

# MongoDB restore
mongorestore --uri "mongodb://user:pass@host:port/database" ./backup
```

## Support & Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [AWS Developer Guide](https://docs.aws.amazon.com/index.html)
- [Azure Documentation](https://docs.microsoft.com/azure/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
