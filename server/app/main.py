from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# importing Routes
from app.routes import employee

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # OK for now, tighten later
    allow_methods=["*"],
    allow_headers=["*"],
)

# Providing Routes
app.include_router(employee.router, tags=["Employees"]) 

@app.get("/health")
def health_check():
    return {"status": "ok"}
