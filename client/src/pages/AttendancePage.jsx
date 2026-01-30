import { useEffect, useState } from "react";
import { fetchEmployees } from "../services/employees";
import {
  markAttendance,
  fetchAttendanceByEmployee,
} from "../services/attendance";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetchEmployees();
      setEmployees(res.data);
    } catch {
      setError("Failed to load employees");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !date) {
      setError("Please select employee and date");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await markAttendance({
        employee_id: selectedEmployee,
        date,
        status,
      });
      await loadAttendance(selectedEmployee);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async (employeeId) => {
    try {
      setLoading(true);
      const res = await fetchAttendanceByEmployee(employeeId);
      setAttendance(res.data);
    } catch {
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    if (empId) {
      loadAttendance(empId);
    } else {
      setAttendance([]);
    }
  };

  return (
    <div>
      <h3>Attendance</h3>

      {error && (
        <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
      )}

      {/* Attendance Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <select value={selectedEmployee} onChange={handleEmployeeChange}>
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.employee_id} value={emp.employee_id}>
              {emp.full_name} ({emp.employee_id})
            </option>
          ))}
        </select>
        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Mark Attendance"}
        </button>
      </form>

      {/* Attendance List */}
      {loading && <p>Loading...</p>}

      {!loading && selectedEmployee && attendance.length === 0 && (
        <p>No attendance records found.</p>
      )}

      {!loading && attendance.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att, index) => (
              <tr key={index}>
                <td>{att.date}</td>
                <td>{att.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
