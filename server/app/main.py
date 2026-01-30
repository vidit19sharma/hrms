from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# importing Routes
from app.routes import employee
from app.routes import attendance

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # OK for now, tighten later
    allow_methods=["*"],
    allow_headers=["*"],
)

# Providing Routes for employee 
app.include_router(employee.router, tags=["Employees"]) 

# providing routes for attendance
app.include_router(attendance.router, tags=["Attendance"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
