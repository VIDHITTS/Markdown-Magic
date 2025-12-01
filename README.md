# SnapCode

A modern code editor for HTML, CSS, and JavaScript with live preview and project management.

## Setup

### Backend
```bash
cd backend
npm install
# Configure .env with DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npx prisma generate
nodemon server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

- User authentication (register/login)
- Create and manage code projects
- Live preview with HTML/CSS/JS
- Auto-save functionality
- Dark/Light theme
- Download projects as ZIP
- Responsive design

## Tech Stack

**Frontend:** React, Vite, React Router, Tailwind CSS  
**Backend:** Node.js, Express, Prisma, MySQL  
**Auth:** JWT, Argon2

## API Endpoints

**Auth:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

**Projects:**
- `GET /api/code/all`
- `GET /api/code/:id`
- `POST /api/code/create`
- `PUT /api/code/:id`
- `PATCH /api/code/:id/metadata`
- `DELETE /api/code/:id`

## Color Theme

**Light Mode:**
- Primary: `#3260a8` (Blue)
- Secondary: `#8D7B44` (Sand)
- Background: `#faf9f7`
