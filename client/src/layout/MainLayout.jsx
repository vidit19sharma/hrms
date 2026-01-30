import { Link } from "react-router-dom";

export default function MainLayout({ children }) {
  return (
    <div>
      <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
        <h2>HRMS Lite</h2>
        <nav style={{ marginTop: "8px" }}>
          <Link to="/employees" style={{ marginRight: "16px" }}>
            Employees
          </Link>
          <Link to="/attendance">Attendance</Link>
        </nav>
      </header>

      <main style={{ padding: "16px" }}>
        {children}
      </main>
    </div>
  );
}
