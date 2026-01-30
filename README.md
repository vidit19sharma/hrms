
# HRMS Lite

## Overview
HRMS Lite is a lightweight Human Resource Management System designed for internal administrative use.  
The application allows an admin to manage employee records and track daily attendance through a clean, simple, and professional web interface.

The scope is intentionally limited to core HR operations, focusing on stability, usability, and correct end-to-end implementation rather than excessive features.

---

## Features

### Employee Management
- Add a new employee with unique Employee ID and Email
- View a list of all employees
- Delete an employee

### Attendance Management
- Mark daily attendance (Present / Absent) for an employee
- Prevent duplicate attendance entries for the same employee on the same date
- View attendance records per employee

### General
- RESTful API design
- Server-side validation and meaningful error messages
- Proper HTTP status codes
- Clean UI with loading, empty, and error states
- Fully deployed frontend and backend

---

## Tech Stack

### Frontend
- JavaScript
- React
- Vite

### Backend
- Python
- FastAPI

### Database
- MongoDB (Atlas)

### Deployment
- Frontend: Vercel
- Backend: Render

---

## Live Application

- **Frontend URL:** https://hrms-nine-navy.vercel.app/
- **Backend API URL:** https://hrms-ugde.onrender.com

> The frontend is fully connected to the live backend API.

---

## API Endpoints (Overview)

### Employee APIs
- `POST /employees` – Add a new employee
- `GET /employees` – Fetch all employees
- `DELETE /employees/{employee_id}` – Delete an employee

### Attendance APIs
- `POST /attendance` – Mark attendance for an employee
- `GET /attendance/{employee_id}` – Get attendance records for an employee

---

## Running the Project Locally

### Prerequisites
- Node.js (v16+ recommended)
- Python (v3.9+ recommended)
- MongoDB Atlas account

---

### Backend Setup

```bash
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload
````

Create a `.env` file in the `server` directory:

```
MONGODB_URI=your_mongodb_atlas_connection_string
```

Backend will run on:

```
http://localhost:8000
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Create a `.env` file in the `client` directory:

```
VITE_API_BASE_URL=http://localhost:8000
```

Frontend will run on:

```
http://localhost:5173
```

---

## Validations & Error Handling

* Required fields are enforced on the backend
* Email format validation is handled using Pydantic
* Duplicate employee (Employee ID or Email) is prevented
* Duplicate attendance for the same employee and date is prevented
* Meaningful error messages are returned using proper HTTP status codes

---

## Assumptions & Limitations

* Single admin user (no authentication required as per assignment scope)
* Leave management, payroll, and advanced HR features are intentionally out of scope
* Free-tier hosting may cause brief cold-start delays on the backend

---

## Deployment Notes

* Backend deployed on Render using FastAPI and MongoDB Atlas
* Frontend deployed on Vercel using Vite
* Environment variables are configured for production
* Application is fully functional via the shared live URLs

---


