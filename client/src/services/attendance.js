import api from './api';

export const markAttendance = async (attendanceData) => {
  const response = await api.post('/attendance', attendanceData);
  return response.data;
};

export const getAttendance = async (employeeId) => {
  const response = await api.get(`/attendance/${employeeId}`);
  return response.data;
};
