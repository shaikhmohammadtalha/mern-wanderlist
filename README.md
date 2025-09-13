# 🌍 WanderList

A **full-stack MERN application** to plan, organize, and visualize your dream travel destinations on an interactive world map. Designed for travel enthusiasts who want to track visited places, plan future trips, and gain insights from statistics.

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-blue?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/ReactQuery-TanStack-FF6347?logo=reactquery&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## ✨ Key Features

* **User Authentication** – Secure signup/login with JWT.
* **Interactive Map** – Drop pins, save destinations, and zoom using **Leaflet + OpenStreetMap**.
* **Destination Management (CRUD)** – Add, edit, delete, categorize, and track visited vs planned destinations.
* **All-Destinations Page** – View all destinations grouped by category, with visual distinction for visited vs planned.
* **Search & Geocoding** – Find locations using **Nominatim API** and save them instantly.
* **Statistics Dashboard** – Pie chart of visited vs planned destinations & bar chart of categories using TanStack charts.
* **Responsive & Modern UI** – Built with **TailwindCSS v4** + **shadcn/ui**, modals/dialogs for smooth UX.
* **Optimized Data Fetching** – Uses **TanStack Query (React Query)** for caching and real-time updates.
* **Full-Stack Deployment** – Frontend on **Vercel**, backend on **Render**, MongoDB Atlas as cloud database.

### ⚡ Resume-Friendly Feature Summary

> Full-stack MERN project with secure JWT authentication, interactive Leaflet map, destination CRUD, stats dashboard with pie/bar charts, all-destinations page, geocoding via Nominatim API, modern responsive UI with TailwindCSS/shadcn/ui, and deployed on Vercel + Render using MongoDB Atlas.

---

## 🛠️ Tech Stack

**Frontend**: React + TypeScript + Vite + TailwindCSS + shadcn/ui + TanStack Query
**Backend**: Node.js + Express + TypeScript
**Database**: MongoDB Atlas (Cloud)
**Maps & Geocoding**: Leaflet + OpenStreetMap + Nominatim API
**Charts**: TanStack Charts (Pie & Bar)
**Deployment**: Vercel (frontend), Render (backend)

---

## 🚀 Live Demo

* Frontend: 🔗 [WanderList on Vercel](https://mern-wanderlist.vercel.app/)
* Backend API: 🔗 [API on Render](https://mern-wanderlist-backend.onrender.com/)

---

## 📸 Screenshots

1. **Interactive Map with Pins**  
   ![Map](https://github.com/shaikhmohammadtalha/mern-wanderlist/blob/main/screenshots/Map.png)

2. **All Destinations Page**  
   ![All Destinations](https://github.com/shaikhmohammadtalha/mern-wanderlist/blob/main/screenshots/AllDestinations.png)

3. **Statistics Dashboard (Pie + Bar Charts)**  
   ![Stats Dashboard](https://github.com/shaikhmohammadtalha/mern-wanderlist/blob/main/screenshots/Stats.png)

---

## 📦 Installation (Local Setup)

```bash
# Clone repo
git clone https://github.com/shaikhmohammadtalha/mern-wanderlist.git
cd wanderlist

# Install dependencies
npm install

# Set environment variables in .env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

# Run backend
cd backend && npm run dev

# Run frontend
cd frontend && npm run dev
```

---

## 📅 Development Progress

* **Day 1-2**: Project setup, backend models (User, Destination), CRUD APIs, JWT authentication.
* **Day 3**: Map integration with Leaflet + OSM, drop pin → save destination.
* **Day 4**: Sidebar & destination cards with shadcn/ui, map zoom on card click.
* **Day 5**: Categories & tags, Nominatim search API, save searched locations.
* **Day 6**: Toggle visited/planned, all-destinations page, stats dashboard (pie & bar chart), coordinate-based destination addition, polished UI.
* **Day 7**: Deployment (Vercel + Render), MongoDB Atlas integration, README & screenshots.

---

## 🧑‍💻 Future Improvements

* Social sharing for your WanderList.
* Weather integration for destinations.
* Trip itinerary planner with route suggestions.
* Offline map support.

---

## 📄 License

MIT License
