from datetime import datetime

def employee_document(data: dict):
    return {
        "employee_id": data["employee_id"],
        "full_name": data["full_name"],
        "email": data["email"],
        "department": data["department"],
        "created_at": datetime.utcnow()
    }

def attendance_document(employee_id, date, status):
    return {
        "employee_id": employee_id,
        "date": date.isoformat(),
        "status": status
    }
