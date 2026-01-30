import api from './api';

export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const addEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  return response.data;
};

export const deleteEmployee = async (employeeId) => {
  const response = await api.delete(`/employees/${employeeId}`);
  return response.data;
};
