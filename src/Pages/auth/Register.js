// src/Pages/user/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import bgImage from "../../image/bgg6.jpg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("❌ Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await set(ref(db, "users/" + user.uid), {
        name,
        phone,
        email,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
      alert("✅ Registration Successful! Welcome 🎉");
      navigate("/login");
    } catch (err) {
      setLoading(false);
      alert("❌ Registration Failed: " + err.message);
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      paddingTop: "40px", 
    },
    overlayBg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      zIndex: 1,
    },
    card: {
      background: "#fff",
      padding: "40px 30px",
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      width: "360px",
      textAlign: "center",
      zIndex: 2,
      position: "relative",
      animation: "fadeIn 0.8s ease-in-out",
    },
    heading: { marginBottom: "25px", color: "#ff7b54", fontWeight: "600" },
    input: {
      width: "95%",
      padding: "12px 15px",
      marginBottom: "20px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      outline: "none",
      transition: "all 0.3s ease",
    },
    button: {
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(90deg, #ff7b54, #ffb347)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    footer: { marginTop: "15px", fontSize: "14px" },
    link: { color: "#ff7b54", textDecoration: "none" },

    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    spinner: {
      width: "60px",
      height: "60px",
      border: "6px solid #f3f3f3",
      borderTop: "6px solid #ff7b54",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <>
      {/* ✅ Navbar at top */}
      <Navbar />

      <div style={styles.container}>
        {/* Dark overlay */}
        <div style={styles.overlayBg}></div>

        {/* Loading spinner */}
        {loading && (
          <div style={styles.overlay}>
            <div style={styles.spinner}></div>
            <p style={{ color: "#fff", marginLeft: "15px", fontSize: "18px" }}>
              Registering...
            </p>
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.heading}>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button style={styles.button} type="submit">
              Register
            </button>
          </form>
          <p style={styles.footer}>
            Already have an account?{" "}
            <Link style={styles.link} to="/login">
              Login
            </Link>
          </p>
        </div>

        {/* Global animations */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            @keyframes fadeIn {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }

            input:focus {
              border-color: #ff7b54;
              box-shadow: 0 0 8px rgba(255,123,84,0.8);
            }

            button:hover {
              box-shadow: 0 0 12px rgba(255,123,84,0.7);
              transform: translateY(-2px);
            }
          `}
        </style>
      </div>
    {/* ✅ Footer at bottom */}
      <Footer />
    </>
  );
}
