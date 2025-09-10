import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Hotel,
  Bed,
  Layers,
  BookOpen,
  LogOut,
  Users as UsersIcon,
  UserPlus,
  BarChart2, // Reports main icon
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openReports, setOpenReports] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Manage Hotels", path: "/admin/hotels", icon: <Hotel size={18} /> },
    { name: "Manage Rooms", path: "/admin/rooms", icon: <Bed size={18} /> },
    { name: "Room Categories", path: "/admin/categories", icon: <Layers size={18} /> },
    { name: "Bookings", path: "/admin/bookings", icon: <BookOpen size={18} /> },
    { name: "Users", path: "/admin/users", icon: <UsersIcon size={18} /> },
    { name: "Add Staff", path: "/admin/staff/new", icon: <UserPlus size={18} /> },
  ];

  const reportItems = [
    { name: "Booking Report", path: "/admin/reports/bookings" },
    { name: "Revenue Report", path: "/admin/reports/revenue" },
    { name: "Room-wise Report", path: "/admin/reports/rooms" },
    { name: "User-wise Report", path: "/admin/reports/users" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo / Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "white",
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          AC
        </div>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Atithi Connect</h2>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path === "/admin/dashboard" && location.pathname === "/admin");
            return (
              <li key={item.name} style={{ marginBottom: "20px" }}>
                <Link
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: active ? "#1e293b" : "white",
                    background: active ? "white" : "transparent",
                    fontWeight: active ? "600" : "400",
                    transition: "0.2s",
                  }}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}

          {/* Reports Dropdown */}
          <li style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setOpenReports(!openReports)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BarChart2 size={18} /> Reports
              </span>
              {openReports ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {openReports && (
              <ul style={{ listStyle: "none", paddingLeft: "20px", marginTop: "10px" }}>
                {reportItems.map((r) => {
                  const active = location.pathname === r.path;
                  return (
                    <li key={r.name} style={{ marginBottom: "10px" }}>
                      <Link
                        to={r.path}
                        style={{
                          display: "block",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          color: active ? "#1e293b" : "white",
                          background: active ? "white" : "transparent",
                          fontWeight: active ? "600" : "400",
                          transition: "0.2s",
                        }}
                      >
                        {r.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#ef4444",
                color: "white",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                marginTop: "40px",
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
