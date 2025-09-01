
# Project Overview

## Startup Overview
This project is a full-stack web application designed to streamline project and order management for startups and businesses. It provides user authentication, an admin dashboard, project and file management, and order processing, all built with a modern tech stack (React, Node.js, Express, MongoDB). The platform aims to simplify workflows, enhance collaboration, and centralize essential business operations in one place.

## Project Structure

- **client/**: Frontend React application (TypeScript, Tailwind CSS)
  - `src/`: Main source code
    - `components/`: UI components (admin, auth, layout)
    - `contexts/`: React context providers (e.g., AuthContext)
    - `pages/`: Application pages
    - `App.tsx`, `index.tsx`, `index.css`: App entry points
  - `public/`: Static assets (HTML, images, logo)
  - `build/`: Production build output
  - `package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`: Config files

- **server/**: Backend (Node.js, Express, MongoDB)
  - `index.js`: Server entry point
  - `middleware/`: Express middleware (e.g., auth)
  - `models/`: Mongoose models (User, Project, Order, etc.)
  - `routes/`: API routes (auth, admin, projects, etc.)
  - `utils/`: Utility functions (e.g., email)
  - `uploads/`: Uploaded files (projects)

- **uploads/**: Project files uploaded by users

- **package.json**: Project dependencies and scripts
- **README.md**: Main project documentation
- **SETUP.md**: Setup instructions

## Main Features
- User authentication (login, register)
- Admin dashboard
- Project management (CRUD)
- File uploads (projects, documents, images)
- Order management
- Category management
- Email notifications

## Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Other**: JWT, Multer (file uploads), Nodemailer (email)

## How It Works
1. Users register/login via the frontend.
2. Authenticated users can create and manage projects, upload files, and place orders.
3. Admins manage users, projects, categories, and orders via the admin dashboard.
4. All data is stored in MongoDB, with file uploads saved to the `uploads/` directory.

## Folder Details
- `client/`: All frontend code and assets
- `server/`: All backend code, models, routes, and uploads
- `uploads/`: User-uploaded files (organized by project)

## Getting Started
See `SETUP.md` for installation and running instructions.

## Authors & License
- Author: [Your Name]
- License: [Specify License]
