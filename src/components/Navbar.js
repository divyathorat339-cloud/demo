import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, database } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, get } from "firebase/database";
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
        background: isHome
          ? "rgba(0, 0, 0, 0.3)"
          : "rgba(0, 0, 0, 0.6)",
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
      }}
    >
      {/* Logo / Brand */}
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Book My Stay
        </Link>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "30px", fontSize: "1rem", alignItems: "center" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/hotels" style={{ color: "#fff", textDecoration: "none" }}>
          Hotels
        </Link>
        <Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>
          About Us
        </Link>
        <Link to="/contact" style={{ color: "#fff", textDecoration: "none" }}>
          Contact Us
        </Link>

        {/* If user not logged in */}
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
                  minWidth: "160px",
                }}
              >
                <Link
                  to="/profile"
                  style={{
                    display: "block",
                    padding: "10px 15px",
                    textDecoration: "none",
                    color: "#000",
                  }}
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/my-bookings"
                  style={{
                    display: "block",
                    padding: "10px 15px",
                    textDecoration: "none",
                    color: "#000",
                  }}
                  onClick={() => setDropdownOpen(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 15px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
