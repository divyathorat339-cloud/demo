// src/components/Navbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, database } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, get } from "firebase/database";
import { FaUser, FaBook, FaSignOutAlt } from "react-icons/fa"; // ✅ Icons

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const snapshot = await get(dbRef(database, `users/${currentUser.uid}`));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const isHome = location.pathname === "/";

  return (
    <nav
      style={{
        background: isHome ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        color: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Book My Stay
        </Link>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "30px", fontSize: "1rem", alignItems: "center" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
        <Link to="/hotels" style={{ color: "#fff", textDecoration: "none" }}>Hotels</Link>
        <Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>About Us</Link>
        <Link to="/contact" style={{ color: "#fff", textDecoration: "none" }}>Contact Us</Link>

        {!user ? (
          <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
            Login
          </Link>
        ) : (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            {/* Profile round icon */}
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#fff",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              title={userData?.name || user.email}
            >
              {(userData?.name?.[0] || user.email[0]).toUpperCase()}
            </div>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  background: "#fff",
                  color: "#000",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  overflow: "hidden",
                  minWidth: "200px",
                  fontFamily: "Segoe UI, Arial, sans-serif",
                }}
              >
                {/* Profile */}
                <Link
                  to="/profile"
                  style={dropdownItemStyle}
                  onClick={() => setDropdownOpen(false)}
                  onMouseEnter={(e) => hoverEffect(e, true)}
                  onMouseLeave={(e) => hoverEffect(e, false)}
                >
                  <FaUser style={iconStyle} /> My Profile
                </Link>

                {/* Bookings */}
                <Link
                  to="/my-bookings"
                  style={dropdownItemStyle}
                  onClick={() => setDropdownOpen(false)}
                  onMouseEnter={(e) => hoverEffect(e, true)}
                  onMouseLeave={(e) => hoverEffect(e, false)}
                >
                  <FaBook style={iconStyle} /> My Bookings
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{ ...dropdownItemStyle, width: "100%", border: "none", background: "none" }}
                  onMouseEnter={(e) => hoverEffect(e, true)}
                  onMouseLeave={(e) => hoverEffect(e, false)}
                >
                  <FaSignOutAlt style={iconStyle} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

/* 🔹 Styles for dropdown items */
const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 15px",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "none",
  color: "#000",
  transition: "all 0.25s ease",
  cursor: "pointer",
};

/* 🔹 Icon style */
const iconStyle = {
  fontSize: "16px",
};

/* 🔹 Hover effect function */
const hoverEffect = (e, isEnter) => {
  e.target.style.background = isEnter ? "#f0f0f0" : "transparent";
  e.target.style.paddingLeft = isEnter ? "20px" : "15px";
};
