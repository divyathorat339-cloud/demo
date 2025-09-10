// src/Pages/admin/StaffManagement.jsx
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  get,
  update,
  serverTimestamp,
} from "firebase/database";
const ROLES = ["Manager", "Front Desk", "Housekeeping", "Maintenance", "Kitchen"];
export default function StaffManagement() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Manager",
    hotelId: "",
  });
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    const db = getDatabase();
    const staffRef = ref(db, "staff");
    const unsubscribe = onValue(staffRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const arr = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
        }));
        setStaffList(arr);
      } else {
        setStaffList([]);
      }
    });
    return () => unsubscribe();
  }, []);
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      role: "Manager",
      hotelId: "",
    });
    setEditId(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.role || !form.hotelId.trim()) {
      alert("Full name, role, and hotel are required.");
      return;
    }
    setLoading(true);
    try {
      const db = getDatabase();
      if (editId) {
        const staffRef = ref(db, `staff/${editId}`);
        await update(staffRef, {
          ...form,
          updatedAt: Date.now(),
          updatedAtServer: serverTimestamp(),
        });
        alert("✅ Staff updated successfully!");
      } else {
        const newRef = push(ref(db, "staff"));
        await set(newRef, {
          ...form,
          status: "active",
          createdAt: Date.now(),
          createdAtServer: serverTimestamp(),
        });
        alert("✅ Staff added successfully!");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save staff.");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (id) => {
    const db = getDatabase();
    const staffRef = ref(db, `staff/${id}`);
    const snap = await get(staffRef);
    if (snap.exists()) {
      setForm(snap.val());
      setEditId(id);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      const db = getDatabase();
      await remove(ref(db, `staff/${id}`));
      alert("🗑️ Staff deleted");
    }
  };
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        {editId ? "✏️ Edit Staff" : "➕ Add Staff"}
      </h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Field label="Full Name *">
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            style={styles.input}
          />
        </Field>
        <Field label="Email">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            style={styles.input}
          />
        </Field>
        <Field label="Phone">
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            style={styles.input}
          />
        </Field>
        <Field label="Role *">
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            style={styles.input}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Hotel ID *">
          <input
            name="hotelId"
            value={form.hotelId}
            onChange={onChange}
            style={styles.input}
          />
        </Field>

        <div style={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.buttonPrimary,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Saving..."
              : editId
              ? "💾 Update Staff"
              : "💾 Save Staff"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={styles.buttonSecondary}
          >
            🔄 Reset
          </button>
        </div>
      </form>

      {/* ✅ Staff List */}
      <h2 style={styles.subtitle}>📋 Staff List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Hotel</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((s) => (
            <tr key={s.id}>
              <td style={styles.td}>{s.fullName}</td>
              <td style={styles.td}>{s.email}</td>
              <td style={styles.td}>{s.phone}</td>
              <td style={styles.td}>{s.role}</td>
              <td style={styles.td}>{s.hotelId}</td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEdit(s.id)}
                  style={styles.actionBtn}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  style={{ ...styles.actionBtn, background: "#ef4444" }}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
          {staffList.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No staff found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}
const styles = {
  page: {
    padding: "30px",
    background: "linear-gradient(135deg, #4f46e5, #3b82f6, #06b6d4)",
    minHeight: "100vh",
  },
  title: { color: "white", marginBottom: "20px", fontSize: "26px" },
  subtitle: { marginTop: "30px", marginBottom: "10px", color: "white" },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    maxWidth: "900px",
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
  field: { display: "grid", gap: "6px" },
  label: { fontWeight: "600", fontSize: "14px", color: "#1e293b" },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
  },
  actions: { gridColumn: "1 / -1", display: "flex", gap: "12px" },
  buttonPrimary: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    background: "#f1f5f9",
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #e2e8f0",
  },
  actionBtn: {
    marginRight: "6px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },
};
