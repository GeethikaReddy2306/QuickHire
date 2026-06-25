# QuickHire

QuickHire is a full-stack MERN job portal for students and recruiters.

Students can register, log in, manage a profile, upload a resume and profile photo, browse open jobs, apply for jobs, and track application status. Recruiters can create companies, post jobs, close jobs, view applicants, download resumes through signed S3 URLs, and update application status.

## Tech Stack

### Frontend
- React + Vite
- React Router
- Axios
- React Toastify
- Chart.js
- Plain CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication with cookies
- bcrypt
- multer memory storage
- AWS S3 with AWS SDK v3

## Project Structure

```text
QuickHire/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    index.js
  frontend/
    src/
      components/
      context/
      Pages/
      style/
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_long_random_jwt_secret
NODE_ENV=development
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_s3_bucket_name
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_SERVER_URL=http://localhost:8000
```

Never commit real `.env` files.

## Local Development

Install backend dependencies:

```bash
cd backend
npm install
npm run dev
```

Install frontend dependencies:

```bash
cd frontend
npm install
npm run dev
```

Default URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
```

## Production Build

Frontend:

```bash
cd frontend
npm run build
```

Backend syntax check:

```bash
cd backend
node --check index.js
```

## Deployment Notes

### Backend
Deploy `backend/` to a Node hosting provider such as Render, Railway, or an EC2/App Service instance.

Use:

```bash
npm install
npm start
```

Set all backend environment variables in the hosting dashboard. Set `CLIENT_URL` to the deployed frontend URL. In production, cookies use `secure: true` and `sameSite: none`, so HTTPS is required.

### Frontend
Deploy `frontend/` to Vercel, Netlify, or any static hosting provider.

Use:

```bash
npm install
npm run build
```

Build output directory:

```text
dist
```

Set `VITE_SERVER_URL` to the deployed backend URL.

## Core API Routes

### User
- `POST /api/user/register`
- `POST /api/user/login`
- `PUT /api/user/profile/update`
- `GET /api/user/resume/:id`

### Company
- `POST /api/company/register`
- `GET /api/company/get`
- `GET /api/company/get/:id`
- `PATCH /api/company/update/:id`

### Job
- `POST /api/job/post`
- `GET /api/job/get`
- `GET /api/job/get/:id`
- `GET /api/job/admin`
- `PATCH /api/job/close/:id`

### Application
- `POST /api/application/apply/:id`
- `GET /api/application/get`
- `GET /api/application/:id/applicants`
- `PATCH /api/application/status/:id`

## Production Checklist

- MongoDB connection string configured
- JWT secret is long and random
- AWS S3 bucket exists in the configured region
- S3 credentials have permission for `PutObject` and `GetObject`
- Frontend `VITE_SERVER_URL` points to the backend URL
- Backend `CLIENT_URL` points to the frontend URL
- Both frontend and backend use HTTPS in production
- Real `.env` files are not committed
