# 🏨 Haven Hotel

A modern full-stack hotel booking platform built with React, TypeScript, Express, PostgreSQL, Prisma, and secure cookie-based authentication.

Haven Hotel provides a complete guest reservation experience alongside a dedicated administration system for managing rooms, bookings, users, images, and hotel operations.

---

## ✨ Overview

Haven Hotel was built as a production-style full-stack application with a focus on:

- Modern responsive design
- Secure authentication
- Hotel room management
- Guest reservations
- Admin operations
- Clean API architecture
- Database-driven content
- Role-based authorization
- Production-oriented security

The project includes both a public-facing hotel website and a protected admin dashboard.

---

## 🚀 Live Demo
https://haven-hotel-pied.vercel.app/



---

## 👤 Guest Features

Guests can:

- Browse available rooms
- View room details
- Search by check-in and check-out dates
- Search by number of guests
- Register for an account
- Log in securely
- Create room reservations
- View personal bookings
- Cancel eligible bookings
- Maintain an authenticated session
- Use the platform across mobile, tablet, and desktop devices

---

## 🛡️ Admin Features

Administrators have access to a dedicated management dashboard with:

- Hotel overview
- Total booking statistics
- Revenue overview
- Registered guest statistics
- Room inventory statistics
- Booking status overview
- Booking management
- Booking status updates
- Room creation
- Room editing
- Room image uploads
- Cloudinary image storage
- Registered user management
- Responsive admin navigation
- Dynamic time-based greeting

---

## 🔄 Booking Lifecycle

Bookings follow a controlled lifecycle:

```text
PENDING
   ↓
CONFIRMED
   ↓
CHECKED_IN
   ↓
CHECKED_OUT
```

Bookings may also be cancelled where permitted.

The backend prevents invalid booking status transitions.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion
- React Router
- Axios
- Lucide React
- React Icons

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Neon PostgreSQL
- JWT
- bcrypt
- Zod
- Multer
- Cloudinary

### Deployment

- **Vercel** — Frontend
- **Render** — Backend
- **Neon** — PostgreSQL Database
- **Cloudinary** — Image Hosting

---

## 🔐 Security

Haven Hotel includes several production-oriented security measures:

- HTTP-only authentication cookies
- JWT-based sessions
- CSRF protection
- Helmet security headers
- CORS origin allowlist
- General API rate limiting
- Authentication-specific rate limiting
- bcrypt password hashing
- Role-based authorization
- Database-backed admin role verification
- Zod request validation
- Generic login errors
- Request body size limits
- Protected guest routes
- Protected admin routes

---

## 🔑 Authentication Architecture

Haven uses HTTP-only cookie authentication.

```text
User logs in
      ↓
Backend validates credentials
      ↓
Backend creates JWT
      ↓
JWT is stored in an HTTP-only cookie
      ↓
Browser sends cookie automatically
      ↓
Backend validates authenticated requests
      ↓
Current user role is checked from database
```

The JWT itself is not stored in browser local storage.

State-changing authenticated requests are also protected using a CSRF token.

---

## 👥 User Roles

Haven currently supports:

```text
GUEST
ADMIN
```

### Guest

A guest can:

- Browse rooms
- Make reservations
- View their reservations
- Cancel eligible bookings

### Admin

An administrator can:

- View hotel statistics
- Manage reservations
- Change booking statuses
- Manage rooms
- Upload room images
- View registered users

Admin permissions are checked against the database rather than trusting a role stored inside the JWT.

---

## 📁 Project Structure

```text
haven-hotel/
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   ├── auth/
│       │   ├── home/
│       │   ├── layout/
│       │   └── rooms/
│       │
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── App.tsx
│
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── controllers/
│       ├── generated/
│       ├── lib/
│       ├── middleware/
│       ├── routes/
│       ├── schemas/
│       ├── types/
│       └── server.ts
│
└── README.md
```

---

## 🌐 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Rooms

```http
GET /api/rooms
GET /api/rooms/:id
```

### Bookings

```http
POST  /api/bookings
GET   /api/bookings/me
GET   /api/bookings/:id
PATCH /api/bookings/:id/cancel
```

### Admin

```http
GET   /api/admin/overview

GET   /api/admin/bookings
PATCH /api/admin/bookings/:id/status

GET   /api/admin/rooms
POST  /api/admin/rooms
PATCH /api/admin/rooms/:id
POST  /api/admin/rooms/upload-image

GET   /api/admin/users
```

---

## 🗄️ Database

Haven uses PostgreSQL hosted on Neon.

The application contains three primary models.

### User

Stores:

- Name
- Email
- Hashed password
- Role
- Account creation date

### Room

Stores:

- Room name
- Description
- Price
- Capacity
- Image URL

### Booking

Stores:

- Guest
- Room
- Check-in date
- Check-out date
- Number of guests
- Total price
- Booking status

---

## 🖼️ Image Uploads

Room images are uploaded through the Express backend using Multer and stored on Cloudinary.

Uploaded images are processed with:

- Automatic resizing
- Automatic cropping
- Automatic quality optimization
- Automatic format optimization

The final hosted image URL is stored in PostgreSQL.

---

## ✅ Validation

Haven uses Zod for server-side request validation.

Validation currently covers areas including:

- Email addresses
- Passwords
- Required authentication fields
- Room IDs
- Guest counts
- Booking dates
- Check-out occurring after check-in

---

## 🔒 Password Requirements

New passwords require:

- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

Passwords are hashed with bcrypt before being stored in the database.

---

## ⚙️ Environment Variables

### Server

Create a `.env` file inside:

```text
server/.env
```

Example:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secure_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Client

Create:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

Environment files containing secrets should never be committed to the repository.

---

## 💻 Running the Project Locally

Clone the repository:

```bash
git clone <your-repository-url>
cd haven-hotel
```

### Backend Setup

```bash
cd server
npm install
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

The API runs locally at:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs locally at:

```text
http://localhost:5173
```

---

## 📱 Responsive Design

Haven Hotel is designed to work across:

- Mobile phones
- Tablets
- Laptops
- Desktop displays

Both the guest experience and the admin dashboard use responsive layouts.

---

## 🧠 Engineering Concepts Demonstrated

This project demonstrates practical implementation of:

- Full-stack application architecture
- REST API development
- React application development
- TypeScript
- Relational database modeling
- Prisma ORM
- Authentication
- Authorization
- HTTP-only cookies
- CSRF protection
- Password hashing
- API rate limiting
- Request validation
- Cloud image uploads
- Responsive interface design
- Role-based dashboards
- Production deployment

---

## 🔮 Future Improvements

Potential future additions include:

- Online payment integration
- Email booking confirmations
- Forgot-password flow
- Password reset
- Hotel availability calendar
- Booking notifications
- Automated check-in reminders
- User profile editing
- Advanced admin analytics
- Automated testing
- CI/CD
- Session rotation
- Cloudinary asset cleanup

---

## 👨‍💻 Author

**Temitope Eniola**

Frontend / Software Engineer

Haven Hotel was built as a full-stack portfolio project demonstrating modern frontend development, backend engineering, database integration, authentication, application security, and administrative workflows.

---

## 📄 License

This project is intended for educational and portfolio purposes.
