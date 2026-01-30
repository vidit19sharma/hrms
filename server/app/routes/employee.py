from fastapi import APIRouter, HTTPException, status
from app.database import employee_collection , attendance_collection
from app.schemas import EmployeeCreate
from app.models import employee_document


router = APIRouter()

# Handle Get Request
@router.get("/employees")
def get_all_employees():
    employees = list(employee_collection.find({}, {"_id": 0}))
    return employees


# Handle Post Request
@router.post(
    "/employees",
    status_code=status.HTTP_201_CREATED
)
def create_employee(employee: EmployeeCreate):
    # Check for duplicate employee_id or email
    existing_employee = employee_collection.find_one({
        "$or": [
            {"employee_id": employee.employee_id},
            {"email": employee.email}
        ]
    })

    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee with this ID or email already exists"
        )

    employee_collection.insert_one(
        employee_document(employee.dict())
    )

    return {"message": "Employee created successfully"}


# Handle Delete Request
@router.delete(
    "/employees/{employee_id}",
    status_code=status.HTTP_200_OK
)
def delete_employee(employee_id: str):
    # Step 1: Check if employee exists
    employee = employee_collection.find_one(
        {"employee_id": employee_id}
    )

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Step 2: Delete employee record
    employee_collection.delete_one(
        {"employee_id": employee_id}
    )

    # Step 3: Cascade delete attendance records
    attendance_collection.delete_many(
        {"employee_id": employee_id}
    )

    return {
        "message": "Employee and related attendance records deleted successfully"
    }