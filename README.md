<div align="center">

# 🚖 Ubar

### A production-ready, full-stack ride-booking application

Built with the **M.E.R.N** stack — real-time ride requests over Socket.IO, live GPS tracking, OpenStreetMap-based routing, and distance-based fare calculation.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

<a href="https://ubar-app.netlify.app/">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_App-black?style=for-the-badge" alt="Live Demo" />
</a>

</div>

<br/>

## 📑 Table of Contents

- [🚖 Ubar](#-ubar)
    - [A production-ready, full-stack ride-booking application](#a-production-ready-full-stack-ride-booking-application)
  - [📑 Table of Contents](#-table-of-contents)
  - [📖 Overview](#-overview)
  - [✨ Features](#-features)
  - [🖼️ Screenshots](#️-screenshots)
  - [🛠️ Tech Stack](#️-tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Maps \& Location](#maps--location)
    - [Deployment \& Tools](#deployment--tools)
  - [📁 Folder Structure](#-folder-structure)
  - [⚙️ Installation](#️-installation)
  - [🔑 Environment Variables](#-environment-variables)
  - [📡 API Endpoints](#-api-endpoints)
  - [🏗️ Architecture](#️-architecture)
  - [🗄️ Database Collections](#️-database-collections)
  - [🔐 Authentication](#-authentication)
  - [🗺️ Maps \& Routing](#️-maps--routing)
  - [🚀 Deployment](#-deployment)
  - [🔮 Future Improvements](#-future-improvements)
  - [👤 Author](#-author)
    - [Tanvir Pathan](#tanvir-pathan)
  - [📄 License](#-license)

---

## 📖 Overview

Ubar is a two-sided ride-hailing platform with completely separate, real-time experiences for **Riders** and **Captains (drivers)**. Riders search a pickup and destination, get matched with nearby online captains within a live radius, and track their ride from request to drop-off. Captains receive live ride requests via WebSockets, accept and navigate to the pickup, and get a running record of their trips and earnings.

---

## ✨ Features

- 🔐 JWT-based authentication for both Users and Captains
- 🔒 Password hashing with bcrypt
- 📍 Real address search & geocoding via OpenStreetMap Nominatim
- 🗺️ Real road-route generation and live distance tracking via OSRM
- 📡 Real-time ride requests and status updates over Socket.IO
- 🛰️ Live captain GPS tracking, broadcast to the rider in real time
- 💰 Transparent, distance-based fare calculation (₹/km)
- 🚗 Multi-vehicle support — Car, Bike, and Auto
- 🖼️ Profile photo uploads via Cloudinary, proxied securely through the backend
- 📜 Ride history and earnings tracking for captains
- 📱 Fully responsive, mobile-first UI

---

## 🖼️ Screenshots

> _Add your own screenshots here whenever you're ready — Home, Login/Signup, Location Search, Vehicle Selection, Captain Dashboard, Live Tracking, Ride History._

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-338033?style=flat-square&logo=letsencrypt&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6600?style=flat-square)
![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=flat-square&logo=dotenv&logoColor=black)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)

### Maps & Location
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=flat-square&logo=openstreetmap&logoColor=white)
![Nominatim](https://img.shields.io/badge/Nominatim-000000?style=flat-square)
![OSRM](https://img.shields.io/badge/OSRM-Routing_Engine-1E88E5?style=flat-square)

### Deployment & Tools
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)

---

## 📁 Folder Structure

```
Ubar/
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── utils/
│   │   └── assets/
│   └── package.json
└── Backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    ├── middlewares/
    ├── socket/
    └── package.json
```

---

## ⚙️ Installation

```bash
git clone https://github.com/<your-username>/ubar.git

cd Frontend
npm install
npm run dev

cd ../Backend
npm install
npm start
```

---

## 🔑 Environment Variables

**Frontend** (`.env`)
```
VITE_BASE_URL=
```

**Backend** (`.env`)
```
PORT=
DB_CONNECT=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> ⚠️ Never commit real secrets — the values above are placeholders only.

---

## 📡 API Endpoints

**Users**
```
POST   /users/register
POST   /users/login
GET    /users/profile
GET    /users/logout
PUT    /users/update-profile
GET    /users/photo/:id
```

**Captains**
```
POST   /captains/register
POST   /captains/login
GET    /captains/profile
GET    /captains/logout
PUT    /captains/update-profile
GET    /captains/:id/photo
POST   /captains/go-online
POST   /captains/go-offline
```

**Rides**
```
POST   /rides/create
GET    /rides/recent
GET    /rides/nearby-captains
POST   /rides/accept
POST   /rides/start-ride
POST   /rides/complete-ride
POST   /rides/cancel
GET    /rides/history/user
GET    /rides/history/captain
```

---

## 🏗️ Architecture

```
React (Vite)
     │
     ▼
   Axios ──────────────► Express.js
                              │
                              ▼
                        Controllers
                              │
                              ▼
                          Services
                              │
                              ▼
                       MongoDB Atlas
                              │
                              ▼
                          Socket.IO
                              │
                              ▼
                     Captain  ⇄  User
```

---

## 🗄️ Database Collections

- `users`
- `captains`
- `rides`

---

## 🔐 Authentication

- JWT tokens issued on login/register
- Passwords hashed with bcrypt before storage
- Token blacklisting on logout
- Protected routes via auth middleware, sent as Bearer tokens / cookies

---

## 🗺️ Maps & Routing

- **Nominatim** — free-text address search and geocoding
- **OSRM** — real road-network routes, live distance and duration between two points
- **Haversine formula** — straight-line distance for nearby-captain radius checks

---

## 🚀 Deployment

- **Frontend** — Netlify
- **Backend** — Render
- **Database** — MongoDB Atlas

---

## 🔮 Future Improvements

- 💳 Online payments (Stripe / Razorpay)
- ⭐ Driver & rider ratings
- 🔔 Push notifications
- 💬 In-app chat
- 📊 Admin dashboard & analytics

---

## 👤 Author

<div align="center">

<img src="https://media.licdn.com/dms/image/v2/D4D03AQHZIbPBb4qJJw/profile-displayphoto-scale_400_400/B4DZi12GB3H4Ag-/0/1755397515445?e=1785369600&v=beta&t=WjslMPxE0uAxXZNH6MdIMpmMLLDDvigPPO7cn5BOkz8"
     width="150" height="150" style="border-radius: 50%; object-fit: cover; border: 3px solid #000;" alt="Tanvir Pathan" />

### Tanvir Pathan
**Aspiring Full-Stack Developer**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![MERN](https://img.shields.io/badge/MERN_Stack-Developer-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Docker Hub](https://img.shields.io/badge/Docker_Hub-2496ED?style=flat-square&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)

*Internship & Project Experience*

<br/>

<a href="https://www.linkedin.com/in/tanvir-pathan-3b1b12337/">
  <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>
<a href="https://ubar-app.netlify.app/">
  <img src="https://img.shields.io/badge/Portfolio-Ubar_App-black?style=for-the-badge" alt="Live Project" />
</a>

</div>

---

## 📄 License

This project is licensed under the **MIT License**.