# Edu Tech - Academic Project Management Platform

A complete full-stack website for managing academic projects, built with modern technologies and best practices.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - Secure login/signup with JWT
- **Project Management** - Create, manage, and track academic projects
- **Admin Dashboard** - Comprehensive admin panel for project oversight
- **Payment Integration** - Stripe payment gateway for project purchases
- **File Management** - Upload and manage project files and documents
- **Email Notifications** - Automated email alerts and updates
- **Responsive Design** - Mobile-first approach with modern UI/UX

A detailed list of the main features and pages in your EduTech platform:

# Startup Project

A full-stack web application for project and order management, featuring user authentication, admin dashboard, file uploads, and more.


## 🚀 Features
- User authentication (register, login, logout, JWT)
- Project listing, search, filtering, and details
- Add to cart, remove from cart, and checkout
- Order management and order history
- Admin dashboard (manage users, projects, orders)
- Project creation, editing, and approval (admin & users)
- File upload and download for projects
- Email notifications (e.g., order confirmation)
- Payment integration (Stripe)
- User profile management
- Responsive design (mobile & desktop)
- Protected routes (for authenticated users/admin)
- Toast notifications and UI animations
- Security: rate limiting, input validation, CORS, helmet

## 📄 Pages
- Home page
- Projects listing page
- Project detail page
- Cart page
- Checkout page
- Order success page
- Login page
- Register page
- Profile page
- Admin dashboard page
- About page
- Contact page
- Not found (404) page

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose


## 🛡️ Admin Login Details

To access the admin dashboard, use the following credentials:

```
Admin Email: admin@takeoffprojects.com
Admin Password: admin123
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation
1. **Clone the repository:**
    ```sh
    git clone <repo-url>
    cd startup
    ```
2. **Install dependencies:**
    - For client:
       ```sh
       cd client
       npm install
       ```
    - For server:
       ```sh
       cd ../server
       npm install
       ```
3. **Configure environment variables:**
    - Create a `.env` file in `server/` (see `.env.example` if available)
4. **Run the application:**
    - Start backend:
       ```sh
       npm start
       ```
    - Start frontend (in a new terminal):
       ```sh
       cd client
       npm start
       ```

## Folder Structure
See `PROJECT_OVERVIEW.md` for a detailed breakdown.

## License
[Specify License]

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/edutech

# JWT
JWT_SECRET=your-super-secret-jwt-key
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
```

## 📱 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build the React app for production
- `npm start` - Start the production server

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user status

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 📊 Database Models

- **User**: Authentication and profile information
- **Project**: Project details and metadata
- **Order**: Payment and order tracking
- **File**: File uploads and management
- **Category**: Project categories and domains

## 🎨 UI Components

- Modern, responsive design
- Tailwind CSS for styling
- Component-based architecture
- Mobile-first approach
- Accessibility features

## 🚀 Deployment

### Frontend (React)
```bash
cd client
npm run build
# Deploy build folder to your hosting service
```

### Backend (Node.js)
```bash
npm run build
npm start
# Deploy to your server or cloud platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: edutech956@gmail.com
- Phone: +91 7672039975

## 🙏 Acknowledgments

- Edu Tech for the original concept
- Open source community for amazing tools and libraries
- Contributors and developers who helped build this platform

---

**Built with ❤️ for the academic community** 