// src/Pages/admin/Users.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import {
  User as UserIcon,
  Mail,
  Phone,
  Key,
  Calendar,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState({});
  const [q, setQ] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");
    const unsub = onValue(usersRef, (snap) => {
      setUsers(snap.val() || {});
    });
    return () => unsub();
  }, []);

  const list = useMemo(() => {
    const arr = Object.entries(users).map(([uid, data]) => ({ uid, ...data }));
    if (!q.trim()) return arr;
    const s = q.toLowerCase();
    return arr.filter(
      (u) =>
        (u.displayName || u.name || "").toLowerCase().includes(s) ||
        (u.email || "").toLowerCase().includes(s) ||
        (u.phone || "").toLowerCase().includes(s)
    );
  }, [users, q]);

  const handleDelete = async (uid) => {
    if (!window.confirm("Delete this user profile from database?")) return;
    const db = getDatabase();
    await remove(ref(db, `users/${uid}`));
  };

  return (
    <div
      style={{
        padding: "32px",
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #6366f1, #3b82f6, #06b6d4)",
      }}
    >
      <h1
        style={{
          marginBottom: "20px",
          fontSize: "28px",
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        Users Management
      </h1>

      {/* 🔍 Search bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 20,
          background: "white",
          padding: "16px 20px",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <input
          placeholder="🔍 Search name, email, phone..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            width: 320,
            outline: "none",
            fontSize: 14,
            transition: "0.2s",
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #2563eb")}
          onBlur={(e) => (e.target.style.border = "1px solid #d1d5db")}
        />
        <span style={{ opacity: 0.8, fontSize: 14 }}>
          Total: <b>{list.length}</b>
        </span>
      </div>

      {/* Users Table */}
      <div
        style={{
          overflowX: "auto",
          background: "white",
          padding: "20px",
          borderRadius: 12,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 8px",
            minWidth: 720,
          }}
        >
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>UID</th>
              <th style={th}>Created</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr
                key={u.uid}
                style={{
                  background: "#f9fafb",
                  borderRadius: 8,
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#eef2ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
              >
                <td style={td}>{u.displayName || u.name || "-"}</td>
                <td style={td}>{u.email || "-"}</td>
                <td style={td}>{u.phone || "-"}</td>
                <td style={td} title={u.uid}>
                  {u.uid.slice(0, 6)}…{u.uid.slice(-4)}
                </td>
                <td style={td}>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td style={td}>
                  <button
                    onClick={() => setSelectedUser(u)}
                    style={viewBtn}
                    title="View Details"
                  >
                    <Eye size={16} /> View Details
                  </button>{" "}
                  <button
                    onClick={() => handleDelete(u.uid)}
                    style={dangerBtn}
                    title="Delete profile"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 20,
                    textAlign: "center",
                    opacity: 0.7,
                    fontSize: 15,
                  }}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🌟 Modal Overlay */}
      {selectedUser && (
        <div style={overlay}>
          <div style={modalBox}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b" }}>
              👤 User Details
            </h2>
            <div style={{ marginTop: 16 }}>
              <p style={detailItem}>
                <UserIcon size={18} color="#2563eb" />{" "}
                <b>Name:</b> {selectedUser.displayName || selectedUser.name || "-"}
              </p>
              <p style={detailItem}>
                <Mail size={18} color="#16a34a" />{" "}
                <b>Email:</b> {selectedUser.email || "-"}
              </p>
              <p style={detailItem}>
                <Phone size={18} color="#f97316" />{" "}
                <b>Phone:</b> {selectedUser.phone || "-"}
              </p>
              <p style={detailItem}>
                <Key size={18} color="#9333ea" />{" "}
                <b>UID:</b> {selectedUser.uid}
              </p>
              <p style={detailItem}>
                <Calendar size={18} color="#dc2626" />{" "}
                <b>Created:</b>{" "}
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleString()
                  : "-"}
              </p>
            </div>
            <button onClick={() => setSelectedUser(null)} style={closeBtn}>
              <XCircle size={18} /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "12px 14px",
  fontWeight: 700,
  fontSize: 14,
  color: "#374151",
  borderBottom: "2px solid #e5e7eb",
};
const td = {
  padding: "12px 14px",
  fontSize: 14,
  color: "#1f2937",
};
const viewBtn = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "none",
  background: "#42a5f5",
  color: "white",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  marginRight: 6,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  transition: "0.2s",
};
const dangerBtn = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  transition: "0.2s",
};
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 50,
  animation: "fadeIn 0.3s ease",
};
const modalBox = {
  background: "white",
  padding: "24px 28px",
  borderRadius: 14,
  width: "420px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  animation: "slideIn 0.3s ease",
};
const detailItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 15,
  marginBottom: 10,
  color: "#334155",
};
const closeBtn = {
  marginTop: 20,
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#42a5f5",
  color: "white",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  transition: "0.2s",
};
