# Quick Hire – Job Portal Web Application

## 📌 Project Overview

Quick Hire is a full-stack job portal web application designed to connect job seekers with recruiters. The platform allows users to browse job opportunities, apply for jobs, manage applications, and explore company profiles through a modern and user-friendly interface.

The main goal of Quick Hire is to simplify the hiring process by providing an efficient platform where candidates can discover opportunities and recruiters can find suitable talent.

---

## 🚀 Features

### 👨‍💼 Job Seeker Features

* User Registration and Login
* Secure Authentication
* Browse Available Jobs
* Search and Filter Jobs
* View Job Details
* Apply for Jobs
* Upload Resume
* Track Application Status
* Manage User Profile

### 🏢 Recruiter Features

* Recruiter Registration and Login
* Post New Jobs
* Update Job Listings
* Delete Job Listings
* View Applicants
* Manage Recruitment Process

### 🌟 Additional Features

* Responsive Design
* Protected Routes
* Form Validation
* Error Handling
* JWT Authentication
* Cloud-Based Resume Storage
* Modern User Interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3
* HTML5

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcrypt.js

### File Upload

* Multer
* Cloudinary

---

## 📂 Project Structure

```
Quick-Hire/
│
├── client/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Routes/
│   │   ├── Services/
│   │   └── App.jsx
│   │
│   └── public/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/GeethikaReddy2306/quick-hire.git
```

### Navigate to Project

```bash
cd quick-hire
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm start
```

Application will run on:

```bash
Frontend: http://localhost:5173/

Backend: http://localhost:5000
```

---

## 📸 Screens

* Home Page
* Login Page
* Register Page
* Job Listings Page
* Job Details Page
* Profile Page
* Recruiter Dashboard

---

## 🎯 Future Enhancements

* Real-Time Chat Between Recruiters and Candidates
* Email Notifications
* AI-Based Resume Screening
* Interview Scheduling
* Company Reviews and Ratings
* Referral System
* Job Recommendations using Machine Learning

---

## 👨‍💻 Author

Developed as a full-stack MERN Project to simplify job searching and recruitment processes.

---

## 📄 License

This project is developed for educational and learning purposes.
