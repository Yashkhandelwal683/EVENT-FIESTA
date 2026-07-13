# Event Fiesta

A full-stack event management and ticket booking platform built with the MERN stack. Organizers can create events, manage ticket tiers, and scan QR codes at venues. Customers can browse events, book tickets, and receive digital QR-coded tickets. Admins get a complete dashboard for platform oversight.

## Features

### For Customers
- Browse and search events with filters (category, city, date)
- Multi-tier ticket selection (VIP, General, Early Bird)
- Secure checkout with Razorpay payment integration
- QR-coded digital tickets with PDF download
- Booking management and cancellation requests
- Wishlist functionality

### For Organizers
- Create and manage events with image uploads (Cloudinary)
- Define ticket tiers with pricing and quantity limits
- Live QR scanner for venue check-in
- Revenue tracking and analytics dashboard
- Attendee management and CSV/Excel export
- Calendar view and report generation

### For Admins
- Platform-wide user, event, and booking management
- Organizer approval workflow
- Revenue and commission tracking
- Analytics with charts (revenue, bookings, user growth)
- Ticket request approval/rejection
- Cancellation and refund management

### Technical
- Real-time ticket availability updates via Socket.IO
- JWT authentication with access/refresh token flow
- Role-based access control (attendee, organizer, admin)
- Rate limiting and security headers (Helmet)
- Google OAuth integration
- Automated email notifications (Nodemailer)

## Tech Stack

### Frontend (`client/`)
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Styling |
| Redux Toolkit + RTK Query | State management and API calls |
| React Router v7 | Client-side routing |
| Socket.IO Client | Real-time updates |
| Axios | HTTP client |
| React Hook Form + Zod | Form validation |
| Framer Motion | Animations |
| Recharts | Charts and analytics |
| jsPDF | PDF ticket generation |
| html5-qrcode | QR code scanning |

### Backend (`server/`)
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication |
| Passport.js | Google OAuth |
| Socket.IO | Real-time communication |
| Razorpay | Payment processing |
| Cloudinary | Image storage |
| Nodemailer | Email service |
| QRCode | QR code generation |
| PDFKit | PDF generation |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |

## Folder Structure

```
EVENT-FIESTA/
├── client/                     # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Axios client config
│   │   ├── app/                # Redux store
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Navbar, Footer, Sidebar
│   │   │   ├── events/         # Event cards, filters, creation
│   │   │   ├── bookings/       # Booking cards, QR modal
│   │   │   ├── dashboard/      # Dashboard widgets
│   │   │   ├── admin/          # Admin panel components
│   │   │   ├── charts/         # Analytics charts
│   │   │   └── ui/             # Button, Input, Modal, etc.
│   │   ├── features/           # RTK Query APIs + Redux slices
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Route layouts
│   │   ├── pages/              # Route-level components
│   │   │   ├── auth/           # Login, Register, OAuth callback
│   │   │   ├── dashboard/      # Organizer dashboard pages
│   │   │   ├── attendee/       # Attendee dashboard pages
│   │   │   ├── organizer/      # Organizer management pages
│   │   │   └── admin/          # Admin panel pages
│   │   ├── store/              # Zustand stores
│   │   └── utils/              # Helpers and validators
│   ├── .env.example
│   └── vite.config.js
│
├── server/                     # Node.js + Express backend
│   ├── config/                 # DB, Redis, Passport, Cloudinary
│   ├── controllers/            # Route handler logic
│   ├── middleware/              # Auth, error handling, rate limiting
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── services/               # Email, QR, PDF, token services
│   ├── socket/                 # Socket.IO handlers
│   ├── jobs/                   # Scheduled tasks
│   ├── utils/                  # ApiError, ApiResponse helpers
│   ├── .env.example
│   └── server.js               # Entry point
│
├── package.json                # Root scripts (dev, build, start)
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 9.x
- MongoDB Atlas account (or local MongoDB)
- Razorpay account
- Cloudinary account
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yashkhandelwal683/EVENT-FIESTA.git
   cd EVENT-FIESTA
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Copy the example env files and fill in your credentials:
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

5. **Run the development servers**
   ```bash
   # From the root directory (runs both client and server)
   npm run dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_ACCESS_SECRET` | JWT signing secret | `<random hex string>` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `<random hex string>` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-...` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_secret` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `EMAIL_USER` | SMTP email address | `you@gmail.com` |
| `EMAIL_PASS` | SMTP app password | `xxxx xxxx xxxx` |
| `RAZORPAY_KEY_ID` | Razorpay key | `rzp_test_xxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | `your_secret` |
| `QR_SECRET` | QR code signing key | `<random hex string>` |

### Frontend (`client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_SOCKET_URL` | Socket.IO server URL | `http://localhost:5000` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay client key | `rzp_test_xxx` |

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Add environment variables
5. Deploy

### Backend (Railway)

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set root directory to `server`
4. Add all backend environment variables
5. Deploy

### Database (MongoDB Atlas)

1. Create a cluster on [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist your IP addresses
4. Get the connection string and add to `MONGO_URI`

### Environment Setup Checklist

- [ ] Rotate all secrets (JWT, Cloudinary, Razorpay, Google OAuth, SMTP)
- [ ] Create new MongoDB Atlas user with strong password
- [ ] Generate new JWT secrets: `openssl rand -hex 64`
- [ ] Update `CLIENT_URL` to production frontend URL
- [ ] Update `GOOGLE_CALLBACK_URL` to production backend URL
- [ ] Set Razorpay to live mode for production

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/logout` | Logout | Private |
| GET | `/api/auth/google` | Google OAuth redirect | Public |
| GET | `/api/auth/google/callback` | Google OAuth callback | Public |

### Events
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/events` | List events (filtered) | Public |
| GET | `/api/events/featured` | Featured events | Public |
| GET | `/api/events/:id` | Event details | Public |
| POST | `/api/events` | Create event | Organizer |
| PUT | `/api/events/:id` | Update event | Organizer |
| DELETE | `/api/events/:id` | Delete event | Admin/Organizer |

### Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/bookings` | Create booking | Customer |
| GET | `/api/bookings/my-bookings` | User's bookings | Customer |
| GET | `/api/bookings/:id` | Booking details | Private |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | Customer |

### Payments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/payments/create-order` | Create Razorpay order | Customer |
| POST | `/api/payments/verify` | Verify payment | Customer |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/stats` | Platform statistics | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| DELETE | `/api/admin/users/:id` | Remove user | Admin |
| GET | `/api/admin/events` | All events | Admin |
| PUT | `/api/admin/events/:id/status` | Approve/reject event | Admin |

## User Roles

**Admin** - Full platform access. Manage users, events, bookings, revenue reports, and analytics.

**Organizer** - Create and manage events, set ticket tiers, scan QR codes at venues, view attendance stats.

**Customer** - Browse events, book tickets, make payments, receive QR-coded tickets, manage bookings.

## License

This project is private and proprietary.
