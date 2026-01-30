from fastapi import APIRouter, HTTPException
from app.database import employee_collection
from app.schemas import AttendanceCreate
from app.models import attendance_document

router = APIRouter()

@router.post("/attendance")
def mark_attendance(data: AttendanceCreate):
    employee = employee_collection.find_one(
        {"employee_id": data.employee_id}
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )
