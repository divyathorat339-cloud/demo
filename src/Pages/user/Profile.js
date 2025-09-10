// src/Pages/user/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth, database } from "../../firebase";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { ref as dbRef, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import bgImage from "../../image/bg111.jpg";
import { FaUser, FaLock, FaTrash, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const snapshot = await get(dbRef(database, `users/${currentUser.uid}`));
        if (snapshot.exists()) {
          setFormData({
            name: snapshot.val().name || "",
            phone: snapshot.val().phone || "",
            address: snapshot.val().address || "",
            dob: snapshot.val().dob || "",
            gender: snapshot.val().gender || "",
          });
        }
        setLoading(false);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await update(dbRef(database, `users/${user.uid}`), { ...formData });
      await updateProfile(user, { displayName: formData.name });
      showToast("Profile updated successfully ✅", "success");
    } catch (error) {
      console.error(error);
      showToast("Error updating profile ❌", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return showToast("Enter new password", "error");
    try {
      await updatePassword(user, newPassword);
      showToast("Password updated successfully 🔑", "success");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      showToast("Error updating password ❌", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteUser(user);
        showToast("Account deleted permanently 🗑️", "success");
        navigate("/register");
      } catch (error) {
        console.error(error);
        showToast("Error deleting account ❌", "error");
      }
    }
  };

  if (loading)
    return <p style={{ marginTop: "100px", textAlign: "center" }}>Loading...</p>;

  return (
    <>
      <Navbar />
      <div
        style={{
          marginTop: "60px",
          minHeight: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "40px 20px",
          position: "relative",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "15px",
            padding: "30px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            animation: "fadeIn 0.6s ease-in-out",
            marginTop: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              textAlign: "center",
              marginBottom: "10px",
              color: "#333",
            }}
          >
            <FaUser style={{ marginRight: "8px", color: "#007bff" }} />
            My Profile
          </h2>
          <p style={{ fontSize: "0.95rem", textAlign: "center", color: "#666" }}>
            Update your account details
          </p>

          {/* Profile Form */}
          <form
            onSubmit={handleUpdate}
            style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}
          >
            <label style={{ fontSize: "0.9rem", color: "#444" }}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required />

            <label style={{ fontSize: "0.9rem", color: "#444" }}>Email</label>
            <input type="email" value={user?.email} disabled style={{ ...inputStyle, background: "#eee", cursor: "not-allowed" }} />

            <label style={{ fontSize: "0.9rem", color: "#444" }}>
              <FaPhone style={{ marginRight: "6px", color: "#007bff" }} /> Phone
            </label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />

            <label style={{ fontSize: "0.9rem", color: "#444" }}>
              <FaMapMarkerAlt style={{ marginRight: "6px", color: "#28a745" }} /> Address
            </label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} />

            <label style={{ fontSize: "0.9rem", color: "#444" }}>
              <FaCalendarAlt style={{ marginRight: "6px", color: "#ff9800" }} /> Date of Birth
            </label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} />

            <label style={{ fontSize: "0.9rem", color: "#444" }}>
              <FaVenusMars style={{ marginRight: "6px", color: "#e91e63" }} /> Gender
            </label>
            <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit" style={buttonStyle} disabled={saving}>
              {saving ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <hr style={{ margin: "25px 0" }} />

          {/* Security Settings */}
          <div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#333" }}>
              <FaLock style={{ marginRight: "8px", color: "#28a745" }} /> Security Settings
            </h3>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "0.9rem", color: "#444", display: "block", marginBottom: "8px" }}>
                New Password
              </label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />
            </div>

            {/* Buttons side by side with gap */}
            <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
              <button onClick={handleChangePassword} style={{ ...buttonStyle, background: "#28a745", flex: 1 }}>
                Change Password
              </button>

              <button onClick={handleDeleteAccount} style={{ ...buttonStyle, background: "#dc3545", flex: 1 }}>
                <FaTrash style={{ marginRight: "10px" }} /> Delete Account permanently
              </button>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast.show && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              padding: "12px 20px",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "bold",
              zIndex: 1000,
              background: toast.type === "success" ? "rgba(40,167,69,0.9)" : "rgba(220,53,69,0.9)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {toast.message}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  outline: "none",
  transition: "0.3s",
  width: "100%",
};

const buttonStyle = {
  background: "#007bff",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
  transition: "0.3s",
};
