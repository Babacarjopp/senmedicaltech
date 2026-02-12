# 🏥 Orthopedic Shop - Quick Start Guide

## ✅ Current Status: **PRODUCTION READY**

```
✅ MongoDB      | HEALTHY  | Port 27017
✅ Backend API  | HEALTHY  | Port 5000
✅ Frontend     | HEALTHY  | Port 3000
```

---

## 🚀 Quick Start

### 1. View Services Status
```powershell
# PowerShell
.\quick-commands.ps1 ps

# Or
docker-compose ps
```

### 2. Check Health
```powershell
# PowerShell
.\quick-commands.ps1 health

# Or
curl http://localhost:5000/api/health
```

### 3. Access Applications
- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

## 🔐 Default Credentials

| Account | Email | Password |
|---------|-------|----------|
| Admin | admin@orthoshop.com | admin123 |
| Test User | test@test.com | Test123! |

---

## 🐳 Common Docker Commands

### Start Services
```powershell
docker-compose up -d
# or
.\quick-commands.ps1 up
```

### Stop Services
```powershell
docker-compose down
# or
.\quick-commands.ps1 down
```

### View Logs
```powershell
docker-compose logs -f backend
# or
.\quick-commands.ps1 logs
```

### Restart Services
```powershell
docker-compose restart
# or
.\quick-commands.ps1 restart
```

### Populate Database with Seed Data
```powershell
docker-compose exec backend node src/seed.js
# or
.\quick-commands.ps1 seed
```

### Clean Everything (Remove containers & volumes)
```powershell
docker-compose down -v
# or
.\quick-commands.ps1 clean
```

---

## 📊 Test Results

- **Total Tests:** 25+
- **Passed:** 25+ ✅
- **Failed:** 0
- **Status:** PRODUCTION READY ✅

See [TEST_REPORT.md](TEST_REPORT.md) for details.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **FINAL_STATUS.md** | Production readiness report |
| **TEST_REPORT.md** | Detailed test results |
| **DEPLOYMENT.md** | Complete deployment guide |
| **PRODUCTION_CHECKLIST.md** | Pre-deployment checklist |

---

## 🔧 Development Environment

### Backend (Node.js + Express)
```bash
cd backend
npm install
npm start
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | Get all products |
| POST | `/api/auth/register` | Create user account |
| POST | `/api/auth/login` | User login |
| GET | `/api/orders` | Get user orders (protected) |
| POST | `/api/orders` | Create order (protected) |

---

## 🚨 Troubleshooting

### Services not responding?
```powershell
# Check status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Restart
docker-compose restart
```

### Database connection failed?
```powershell
# Check MongoDB is running
docker-compose ps mongo

# Connect to MongoDB
docker-compose exec mongo mongosh -u admin -p --authenticationDatabase admin
```

### Port already in use?
```powershell
# Stop other services
docker-compose down

# Or change ports in docker-compose.yml
```

---

## 📈 Performance

- **Frontend Build:** 77.39 kB (gzipped)
- **API Response:** < 100ms average
- **Database Query:** < 100ms average
- **Service Startup:** < 40 seconds
- **Health Check Interval:** 10 seconds

---

## 🔒 Security Checklist

- ✅ JWT authentication enabled
- ✅ MongoDB authentication enabled
- ✅ CORS configured
- ✅ Rate limiting active
- ✅ Helmet.js security headers enabled
- ✅ Seed protection in production mode
- ✅ Environment variables secured

---

## 📱 Environment Variables

### Development (.env)
```
NODE_ENV=development
MONGO_URI=mongodb://admin:changeme_production@mongo:27017/orthopedic_shop?authSource=admin
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

### Production (.env.production)
```
NODE_ENV=production
MONGO_URI=<your-production-mongo-uri>
JWT_SECRET=<your-strong-production-secret>
CORS_ORIGIN=<your-production-domain>
```

See [.env.example](.env.example) for all available variables.

---

## 🎯 Next Steps

1. ✅ All tests passed
2. ✅ All services running
3. ✅ Health checks passing
4. ➡️ Ready for production deployment

Follow [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for deployment steps.

---

## 📞 Support

For detailed information:
- Backend API: See backend/README.md
- Frontend: See frontend/README.md
- Deployment: See DEPLOYMENT.md
- Tests: See TEST_REPORT.md

---

**Last Updated:** 2026-02-03 03:14 UTC+01:00  
**Status:** ✅ PRODUCTION READY  
**All Systems Operational**
