# Edu Tech - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Return to root
cd ..
```

### 2. Environment Setup

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/edutech

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run server    # Backend only
npm run client    # Frontend only
```

## 📁 Project Structure

```
edutech-website/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── package.json            # Root package.json
└── README.md              # Project documentation
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend server only
- `npm run client` - Start React frontend only
- `npm run build` - Build React app for production
- `npm run install-all` - Install all dependencies

### Client Directory
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Server Directory
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Express validator for input validation

## 📱 Features Implemented

### Frontend
- ✅ Responsive design with Tailwind CSS
- ✅ React Router for navigation
- ✅ Authentication context
- ✅ Shopping cart context
- ✅ Form validation with React Hook Form
- ✅ Animations with Framer Motion
- ✅ Toast notifications
- ✅ Protected routes
- ✅ Mobile-responsive navigation

### Backend
- ✅ Express.js server setup
- ✅ MongoDB with Mongoose
- ✅ User authentication system
- ✅ JWT token management
- ✅ Password hashing
- ✅ Input validation
- ✅ Email utility setup
- ✅ Security middleware
- ✅ Rate limiting

## 🚧 Coming Soon

- Project listing and details
- Shopping cart functionality
- Payment integration with Stripe
- Admin dashboard
- File upload system
- Email notifications
- User profile management
- Order management

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **MongoDB connection failed**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network access

3. **Node modules issues**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Tailwind CSS not working**
   ```bash
   # Rebuild CSS
   cd client && npm run build:css
   ```

## 📞 Support

For technical support:
- Email: edutech956@gmail.com
- Phone: +91 7672039975

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Happy Coding! 🚀**
