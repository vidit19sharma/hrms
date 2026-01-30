import api from "./api";

export const markAttendance = (data) => {
  return api.post("/attendance", data);
};

export const fetchAttendanceByEmployee = (employeeId) => {
  return api.get(`/attendance/${employeeId}`);
};
