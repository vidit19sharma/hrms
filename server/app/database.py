from pymongo import MongoClient
from app.core.config import MONGODB_URI, DATABASE_NAME

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

employee_collection = db["employees"]
attendance_collection = db["attendance"]