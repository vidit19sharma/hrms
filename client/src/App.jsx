import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Routes>
    </MainLayout>
  );
}
