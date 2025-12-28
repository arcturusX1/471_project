# 🚀 Complete Backend Setup Guide

This guide will help you set up the **MERN stack backend** for your Campus Management System.

---

## 📋 What You're Building

**BEFORE (Current):**
- ❌ Frontend only (React)
- ❌ Mock data in `/data/mockData.ts`
- ❌ Data lost on refresh
- ❌ No real authentication
- ❌ Role switcher (not real login)

**AFTER (With Backend):**
- ✅ Full MERN stack
- ✅ Real MongoDB database
- ✅ Persistent data storage
- ✅ JWT authentication
- ✅ Real login system
- ✅ Multi-user support

---

## 🛠️ Step-by-Step Setup

### **STEP 1: Install Node.js**

1. Download Node.js from [nodejs.org](https://nodejs.org)
2. Choose **LTS version** (Long Term Support)
3. Install and verify:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

---

### **STEP 2: Install MongoDB**

**Option A: Local MongoDB (Recommended for beginners)**

1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Edition
3. Start MongoDB:

**Windows:**
```bash
# Open Command Prompt as Administrator
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Start on boot
```

4. Verify MongoDB is running:
```bash
mongosh  # Opens MongoDB shell
```

**Option B: MongoDB Atlas (Cloud - FREE)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a FREE cluster (M0 Sandbox)
4. Create database user (username + password)
5. Whitelist IP address (or use 0.0.0.0/0 for testing)
6. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

Example:
```
mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/campus-management
```

---

### **STEP 3: Install Backend Dependencies**

Navigate to the backend folder and install packages:

```bash
cd backend
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB connector
- `bcryptjs` - Password encryption
- `jsonwebtoken` - Authentication tokens
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `nodemon` - Auto-restart server (dev)

---

### **STEP 4: Configure Environment Variables**

1. Create `.env` file:

```bash
cp .env.example .env
```

2. Edit `.env` file:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/campus-management
JWT_SECRET=campus_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/campus-management
JWT_SECRET=campus_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
```

⚠️ **IMPORTANT:** Change `JWT_SECRET` to a random string!

Generate random secret:
```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

### **STEP 5: Seed Database (Create Sample Data)**

This creates test users, projects, and evaluations:

```bash
npm run seed
```

**Output:**
```
🗑️  Cleared existing data
✅ Created users
✅ Created projects
✅ Created evaluations

🎉 Database seeded successfully!

📧 Login credentials:
Admin: admin@campus.edu / admin123
Faculty: sarah.johnson@campus.edu / faculty123
Student: kingkor@student.campus.edu / student123
```

---

### **STEP 6: Start Backend Server**

**Development mode (auto-restart on changes):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**You should see:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

---

### **STEP 7: Test Backend API**

Open browser and go to:
```
http://localhost:5000/api/health
```

**You should see:**
```json
{
  "status": "OK",
  "message": "Campus Management System Backend is running",
  "timestamp": "2024-12-24T10:30:00.000Z"
}
```

✅ **Backend is working!**

---

## 🧪 Testing API with Postman

### 1. Install Postman

Download from [postman.com](https://www.postman.com/downloads/)

### 2. Test Login

**Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

Body (raw JSON):
{
  "email": "student@campus.edu",
  "password": "student123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6576abc...",
    "name": "Kingkor",
    "email": "kingkor@student.campus.edu",
    "role": "student"
  }
}
```

**Copy the `token` value!**

### 3. Test Protected Route (Get Projects)

**Request:**
```
GET http://localhost:5000/api/projects

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "title": "AI-Powered Campus Navigation System",
      "studentName": "Kingkor",
      ...
    }
  ]
}
```

---

## 🔗 Connect Frontend to Backend

Now that backend is running, update your frontend:

### 1. Create `.env` file in frontend root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. The API service is already created at `/services/api.ts`

### 3. Example: Update Login in Frontend

Create a new Login component or update existing role switcher:

```typescript
import { useState } from 'react';
import { authAPI, setAuthToken } from './services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await authAPI.login(email, password);
      
      // Save token
      setAuthToken(response.token);
      
      // Save user data
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 4. Example: Fetch Projects from Backend

Replace mock data with API call:

```typescript
import { useEffect, useState } from 'react';
import { projectsAPI } from './services/api';

function ProjectsList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      {projects.map(project => (
        <div key={project._id}>{project.title}</div>
      ))}
    </div>
  );
}
```

---

## 📁 Full Project Structure (Frontend + Backend)

```
campus-management-system/
├── frontend/                  # React frontend (current files)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── services/
│   │   │   └── api.ts        # ✅ API service (connects to backend)
│   │   └── ...
│   ├── .env                   # Frontend environment variables
│   └── package.json
│
└── backend/                   # ✅ NEW - Node.js backend
    ├── server.js              # Express server
    ├── models/                # MongoDB schemas
    │   ├── User.js
    │   ├── Project.js
    │   ├── Evaluation.js
    │   └── Reservation.js
    ├── routes/                # API endpoints
    │   ├── auth.js
    │   ├── projects.js
    │   ├── evaluations.js
    │   └── reservations.js
    ├── middleware/
    │   └── auth.js            # JWT authentication
    ├── scripts/
    │   └── seedData.js        # Database seeding
    ├── .env                   # Backend environment variables
    ├── package.json
    └── README.md
```

---

## 🐛 Troubleshooting

### Problem: "MongoDB connection refused"

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000    # Mac/Linux
netstat -ano | findstr :5000    # Windows

# Kill the process or change PORT in .env
PORT=5001
```

### Problem: "JWT secret error"

**Solution:** Make sure `.env` file exists and has `JWT_SECRET`

### Problem: "CORS error in browser"

**Solution:** Backend already has CORS enabled. Make sure backend is running on `http://localhost:5000`

---

## 🚀 Deployment (Optional)

### Deploy Backend to Render.com (FREE)

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
5. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Get your backend URL: `https://your-app.onrender.com`

### Update Frontend to Use Production Backend

In frontend `.env`:
```env
REACT_APP_API_URL=https://your-app.onrender.com/api
```

---

## ✅ Checklist

- [ ] Node.js installed (v18+)
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Database seeded (`npm run seed`)
- [ ] Backend server running (`npm run dev`)
- [ ] API health check successful (http://localhost:5000/api/health)
- [ ] Tested login with Postman
- [ ] Frontend `.env` created
- [ ] API service file exists (`/services/api.ts`)

---

## 🎓 Login Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@campus.edu` | `admin123` |
| Faculty | `sarah.johnson@campus.edu` | `faculty123` |
| Faculty | `michael.chen@campus.edu` | `faculty123` |
| Student | `kingkor@student.campus.edu` | `student123` |
| Student | `sunvi@student.campus.edu` | `student123` |

---

## 📚 Next Steps

1. ✅ **Backend Setup Complete**
2. **Update Frontend Components:**
   - Replace mock data with API calls
   - Add real login page
   - Use JWT tokens for authentication
   - Handle loading states
   - Add error handling
3. **Deploy:**
   - Deploy backend to Render/Railway
   - Deploy frontend to Vercel/Netlify
   - Update API URLs

---

## 🎉 Congratulations!

You now have a **complete MERN stack** application with:
- ✅ React frontend
- ✅ Node.js/Express backend
- ✅ MongoDB database
- ✅ JWT authentication
- ✅ RESTful API
- ✅ Persistent data storage

**Your data will now survive page refreshes!** 🚀

---

## 📧 Need Help?

- Backend documentation: `/backend/README.md`
- API endpoints: See Backend README
- Frontend API service: `/services/api.ts`

**Happy Coding!** 🎓
