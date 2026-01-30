import api from "./api";

export const fetchEmployees = () => {
  return api.get("/employees");
};

export const createEmployee = (data) => {
  return api.post("/employees", data);
};

export const deleteEmployee = (employeeId) => {
  return api.delete(`/employees/${employeeId}`);
};
