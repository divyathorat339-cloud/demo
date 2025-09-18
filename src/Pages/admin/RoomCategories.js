// src/Pages/admin/RoomCategories.js
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { ref, set, push, onValue, remove, update } from "firebase/database";
export default function RoomCategories() {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("AC");
  const [beds, setBeds] = useState(1);
  const [amenities, setAmenities] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    const categoriesRef = ref(db, "roomCategories");
    onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        setCategories(Object.entries(snapshot.val())); 
      } else {
        setCategories([]);
      }
    });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label) return alert("Enter category label");
    const categoryData = { label, type, beds, amenities, description };
    if (editingId) {
      await update(ref(db, "roomCategories/" + editingId), categoryData);
      window.alert("✅ Category updated successfully!");
      setEditingId(null);
    } else {
      const newCategoryRef = push(ref(db, "roomCategories"));
      await set(newCategoryRef, categoryData);
      window.alert("✅ Category added successfully!");
    }
    setLabel("");
    setType("AC");
    setBeds(1);
    setAmenities("");
    setDescription("");
  };
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete this category?");
    if (confirmDelete) {
      remove(ref(db, "roomCategories/" + id));
      window.alert("🗑️ Category deleted successfully!");
    }
  };
  const handleEdit = (id, cat) => {
    setLabel(cat.label);
    setType(cat.type);
    setBeds(cat.beds);
    setAmenities(cat.amenities || "");
    setDescription(cat.description || "");
    setEditingId(id);
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "40px 30px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: 480,
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#4f46e5",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          {editingId ? "✏️ Edit Room Category" : "➕ Add Room Category"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Label */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., AC 2 Bed"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>

          {/* Type */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 15,
                outline: "none",
              }}
            >
              <option>AC</option>
              <option>Non-AC</option>
              <option>Deluxe</option>
              <option>Suite</option>
            </select>
          </div>

          {/* Beds */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Beds
            </label>
            <select
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 15,
                outline: "none",
              }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Amenities
            </label>
            <input
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="e.g., Free WiFi, TV, Mini Fridge"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>

          {/* Short Description */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Short Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about this room category"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 15,
                outline: "none",
                resize: "vertical",
                minHeight: 70,
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              background: "#42a5f5",
              color: "white",
              fontWeight: 600,
              padding: "12px",
              borderRadius: 12,
              border: "none",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {editingId ? "Update Category" : "Create Category"}
          </button>
        </form>

        {/* List of categories */}
        <ul style={{ marginTop: 30, padding: 0, listStyle: "none" }}>
          {categories.map(([id, cat]) => (
            <li
              key={id}
              style={{
                padding: "12px 16px",
                background: "#f9fafb",
                borderRadius: 10,
                marginBottom: 10,
                fontSize: 15,
              }}
            >
              <b>{cat.label}</b> ({cat.type}) - {cat.beds} Bed(s)
              <br />
              <span style={{ color: "#4b5563" }}>
                <b>Amenities:</b> {cat.amenities || "N/A"}
              </span>
              <br />
              <span style={{ color: "#6b7280" }}>
                <b>Description:</b> {cat.description || "No description"}
              </span>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleEdit(id, cat)}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
