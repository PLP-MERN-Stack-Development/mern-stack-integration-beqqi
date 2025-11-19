# MERN Blog Integration — Week 4

This repository is a small MERN (MongoDB, Express, React, Node) blog application built for the Week 4 assignment. It demonstrates a full-stack setup with API endpoints, a Vite + React front-end, Mongoose models, authentication, file uploads, and basic client-side state management.

**Status**: working prototype — server and client skeletons are implemented, basic features completed (posts, categories, comments, uploads, Clerk integration wiring).

----

**Contents**
- `server/` — Express API, Mongoose models, controllers, middleware
- `client/` — Vite + React UI, router, pages, services
- `.env.example` files in both `server/` and `client/` showing required environment variables

----

**Quick Start (development)**

Prerequisites:
- Node.js (v18+ recommended)
- MongoDB running locally or accessible via connection string

1. Install server deps and start server:

```bash
cd server
npm install
cp .env.example .env  
npm run dev
```

2. Install client deps and start client:

```bash
cd client
npm install
cp .env.example .env   
npm run dev
```

Open the front-end in the browser (Vite will print the URL, usually `http://localhost:5173`). The API runs on the server port (default `5000`).

----

Environment files included (examples)
- `server/.env.example`
  - `MONGODB_URI` - MongoDB connection string
  - `PORT` - server port (default 5000)
  - `JWT_SECRET` - (kept for legacy/development flows)
  - `CLERK_API_KEY` - Clerk server key (if using Clerk server-side verification)
- `client/.env.example`
  - `VITE_API_URL` - base API URL for axios/Vite proxy during dev



----

API Documentation (implemented endpoints)

Base URL: `http://localhost:5000/api`

- Posts
  - GET `/posts` — list posts (supports `page`, `limit`, `category`, `q` search query)
    - Example: `GET /api/posts?page=1&limit=10&q=hello`
  - GET `/posts/:id` — retrieve a single post
  - POST `/posts` — create a post (protected)
    - Requires authentication (server expects Clerk-authenticated requests)
    - Body: `{ title, content, excerpt?, category?, tags?, isPublished? }`
  - PUT `/posts/:id` — update a post (protected)
  - DELETE `/posts/:id` — delete a post (protected)
  - POST `/posts/:id/comments` — add comment to post (protected)

- Categories
  - GET `/categories` — list categories
  - POST `/categories` — create a category

- Auth (legacy JWT flow present) — `POST /auth/register`, `POST /auth/login` (note: Clerk server integration is wired in; decide whether to keep legacy routes)

- Uploads
  - POST `/uploads` — upload a single file using `multipart/form-data` field `file` (returns `{ url: '/uploads/<filename>' }`)

Authentication notes
- The client includes `@clerk/clerk-react`. The server has wiring for Clerk verification (middleware in `server/middleware/clerkAuth.js`). During development, ensure `CLERK_API_KEY` (or required Clerk env var) is set in `server/.env`.
- Protected routes require Clerk-authenticated requests. The client should send the Clerk session token in the `Authorization: Bearer <token>` header. Alternatively, if you prefer to keep the legacy JWT auth, the repo still contains an example `authController` and `middleware/auth.js`.

Client integration example (attach Clerk token to axios)

In your client API calls you can attach the Clerk token like:

```js
// Example using Clerk `getToken` (client side)
import { getToken } from '@clerk/clerk-react';

const token = await getToken();
axios.post('/api/posts', payload, { headers: { Authorization: `Bearer ${token}` } })
```



----

Features implemented
- CRUD for Posts (with Mongoose `Post` model)
- Categories list/create
- Comments on posts (server and route)
- File upload endpoint using `multer`
- Mongoose models and validation using `express-validator` on routes
- Clerk client present and server-side Clerk middleware wiring (protects post routes)
- Front-end pages: post list, single post view, create/edit form
- Front-end state: `PostsContext` with optimistic updates and loading/error handling


 
# MERN Stack Integration Assignment

This assignment focuses on building a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that demonstrates seamless integration between front-end and back-end components.

## Assignment Overview

You will build a blog application with the following features:
1. RESTful API with Express.js and MongoDB
2. React front-end with component architecture
3. Full CRUD functionality for blog posts
4. User authentication and authorization
5. Advanced features like image uploads and comments

## Project Structure

```
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week4-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Files Included

- `Week4-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Configuration files
  - Sample models and components

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement all required API endpoints
3. Create the necessary React components and hooks
4. Document your API and setup process in the README.md
5. Include screenshots of your working application

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/) 