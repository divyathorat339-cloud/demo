// src/Pages/admin/Users.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
export default function Users() {
  const [users, setUsers] = useState({});
  const [q, setQ] = useState("");
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
        (u.displayName || "").toLowerCase().includes(s) ||
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
      background: "linear-gradient(to bottom right, #6366f1, #3b82f6, #06b6d4)",
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
          onFocus={(e) =>
            (e.target.style.border = "1px solid #2563eb")
          }
          onBlur={(e) =>
            (e.target.style.border = "1px solid #d1d5db")
          }
        />
        <span style={{ opacity: 0.8, fontSize: 14 }}>
          Total: <b>{list.length}</b>
        </span>
      </div>

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
                <td style={td}>{u.displayName || "-"}</td>
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
                    onClick={() => handleDelete(u.uid)}
                    style={dangerBtn}
                    title="Delete profile"
                  >
                    🗑 Delete
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
const dangerBtn = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  transition: "0.2s",
};
