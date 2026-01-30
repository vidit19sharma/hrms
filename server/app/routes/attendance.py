from fastapi import APIRouter, HTTPException, status
from app.database import attendance_collection, employee_collection
from app.schemas import AttendanceCreate
from app.models import attendance_document

router = APIRouter()

# Get Attendance
@router.get("/attendance/{employee_id}")
def get_attendance_for_employee(employee_id: str):
    employee = employee_collection.find_one(
        {"employee_id": employee_id}
    )

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    attendance_records = list(
        attendance_collection.find(
            {"employee_id": employee_id},
            {"_id": 0}
        )
    )

    return attendance_records


# post attendance
@router.post(
    "/attendance",
    status_code=status.HTTP_201_CREATED
)
def mark_attendance(data: AttendanceCreate):
    # Check if employee exists
    employee = employee_collection.find_one(
        {"employee_id": data.employee_id}
    )

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Check if attendance already marked for the date
    existing_attendance = attendance_collection.find_one({
        "employee_id": data.employee_id,
        "date": data.date.isoformat()
    })

    if existing_attendance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already marked for this date"
        )

    attendance_collection.insert_one(
        attendance_document(
            data.employee_id,
            data.date,
            data.status
        )
    )

    return {"message": "Attendance marked successfully"}
