# 🌍 WanderList  

A full-stack MERN application where users can plan, organize, and visualize their dream travel destinations on an interactive world map.  

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-blue?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## ✨ Features  
- **User Authentication** – Secure signup/login with JWT.  
- **Interactive Map (Leaflet + OpenStreetMap)** – Drop pins, save destinations, and view them instantly.  
- **Destination Management (CRUD)** – Add, edit, delete, and categorize destinations.  
- **Categories & Tags** – Organize trips as Adventure, Food, Relaxation, etc.  
- **Visited vs Planned** – Track places you’ve visited and those still on your bucket list.  
- **Search Destinations** – Find and zoom into locations via geocoding.  
- **Statistics Dashboard** – See counts of visited vs planned destinations.  
- **Responsive UI** – Built with TailwindCSS + shadcn/ui for modern design.  

---

## 🛠️ Tech Stack  
**Frontend**: React + TypeScript + Vite + TailwindCSS + shadcn/ui + React Query  
**Backend**: Node.js + Express + TypeScript  
**Database**: MongoDB Atlas  
**Maps**: Leaflet + OpenStreetMap + Nominatim API (for geocoding)  
**Deployment**: Vercel (frontend), Render (backend)  

---

## 🚀 Live Demo  
🔗 [Live App on Vercel](#)  
🔗 [Backend API on Render](#)  

---

## 📸 Screenshots  
1. **Dashboard View**  
   _[Insert screenshot]_  
2. **Map with Pins**  
   _[Insert screenshot]_  
3. **Destination Card Example**  
   _[Insert screenshot]_  

---

## 📦 Installation (Local Setup)  

1. Clone repo:  
   ```bash
   git clone https://github.com/shaikhmohammadtalha/mern-wanderlist.git
   cd wanderlist
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Set environment variables (`.env`):  
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   ```

4. Run backend:  
   ```bash
   cd backend && npm run dev
   ```

5. Run frontend:  
   ```bash
   cd frontend && npm run dev
   ```

---

## 🧑‍💻 Future Improvements  
- Social sharing (share your WanderList with friends).  
- Weather integration for destinations.  
- Trip itinerary planner with connected routes.  
- Offline map support.  

---

## 📄 License  
MIT License  
