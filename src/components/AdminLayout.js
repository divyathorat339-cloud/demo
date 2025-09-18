// src/components/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div>
      {/* Sidebar is fixed */}
      <Sidebar />

      {/* Admin Content */}
      <div
        style={{
          marginLeft: "240px",   // push ALL admin pages to the right
          padding: "20px",
          minHeight: "100vh",
          background: "#f9fafb",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
