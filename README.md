# CivicConnect 🚀

CivicConnect is a backend-focused civic complaint management system that enables citizens to raise public issues such as street light faults, water leakage, road damage, etc., and allows administrators to manage and resolve these complaints efficiently through secure APIs.

The project is designed with a real-world backend architecture, focusing on authentication, role-based access control, and scalable API design.

---

## 🔧 Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- RESTful APIs

---

## 📁 Project Structure
CivicConnect/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env (ignored)
│
└── README.md

---

## ▶️ How to Run Backend
cd backend
npm install
node server.js

Server runs at:
http://localhost:3001

---

## 🔐 Environment Variables
Create a .env file inside backend folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001

---

## 📌 API Endpoints

Register User:
POST /api/auth/register

Login User:
POST /api/auth/login

Create Complaint:
POST /api/complaints
Authorization: Bearer <JWT_TOKEN>

Get All Complaints (Admin):
GET /api/admin/complaints
Authorization: Bearer <ADMIN_JWT_TOKEN>

---

## 📊 Database
MongoDB Atlas (Cloud)

Collections:
- users
- complaints

---

## ⭐ Key Highlights
- JWT-based authentication
- Role-based access control (Admin/User)
- RESTful backend architecture
- MongoDB Atlas integration

---

## 👤 Author
Aditya Anand  
Backend Developer | Node.js | Express | MongoDB

---

## 📌 Project Overview
CivicConnect demonstrates backend engineering concepts including authentication, authorization, REST API design, and database modeling.  
The backend is production-ready and structured for future frontend integration.
