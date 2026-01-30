from fastapi import APIRouter, HTTPException
from app.database import employee_collection
from app.schemas import EmployeeCreate
from app.models import employee_document

router = APIRouter()

@router.post("/employees")
def create_employee(employee: EmployeeCreate):
    existing = employee_collection.find_one({
        "$or": [
            {"employee_id": employee.employee_id},
            {"email": employee.email}
        ]
    })

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Employee with this ID or email already exists"
        )

    employee_collection.insert_one(employee_document(employee.dict()))
    return {"message": "Employee created successfully"}
