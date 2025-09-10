import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import bgImage from "../../image/BG.jpg";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer"; 
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState({ show: false, type: "", text: "" });
  const navigate = useNavigate();
  useEffect(() => {
    if (popup.type === "success") {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popup, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setPopup({
        show: true,
        type: "success",
        text: "✅ Password reset email sent! Redirecting to Login...",
      });
    } catch (err) {
      setPopup({
        show: true,
        type: "error",
        text: "❌ Failed to send reset email. Please check your email and try again!",
      });
    }
  };
  return (
    <>
      {/* ✅ Navbar added at top */}
      <Navbar />

      {/* Main Container */}
      <div style={{ ...styles.container, backgroundImage: `url(${bgImage})` }}>
        <div style={styles.card}>
          <h2 style={styles.heading}>🔑 Forgot Password</h2>
          <p style={styles.subtext}>
            Enter your registered email to get a reset link.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="email"
              placeholder="📧 Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button style={styles.button} type="submit">
              Send Reset Email
            </button>
          </form>
          <p style={styles.footer}>
            Remember your password?{" "}
            <Link style={styles.link} to="/login">
              Login
            </Link>
          </p>
        </div>

        {popup.show && (
          <div style={styles.popupOverlay}>
            <div
              style={{
                ...styles.popupBox,
                borderTop:
                  popup.type === "success"
                    ? "5px solid #4CAF50"
                    : "5px solid #F44336",
              }}
            >
              <p
                style={
                  popup.type === "success"
                    ? styles.popupSuccess
                    : styles.popupError
                }
              >
                {popup.text}
              </p>
              <button
                style={styles.popupClose}
                onClick={() => setPopup({ ...popup, show: false })}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Footer added at bottom */}
      <Footer />
    </>
  );
}
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "Poppins, sans-serif",
    paddingTop: "20px", 
  },
  card: {
    background: "#fff",
    padding: "40px 35px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    width: "380px",
    textAlign: "center",
    animation: "fadeIn 0.8s ease-in-out",
  },
  heading: {
    marginBottom: "10px",
    color: "#333",
    fontWeight: "700",
    fontSize: "28px",
  },
  subtext: {
    marginBottom: "25px",
    color: "#555",
    fontSize: "14px",
  },
  input: {
    width: "95%",
    padding: "12px 15px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
    color: "#333",
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
    fontSize: "15px",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  footer: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#333",
  },
  link: {
    color: "#ff7b54",
    textDecoration: "none",
    fontWeight: "600",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupBox: {
    background: "#fff",
    padding: "30px 35px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    maxWidth: "350px",
    animation: "fadeIn 0.4s ease-in-out",
  },
  popupSuccess: {
    color: "#4CAF50",
    fontWeight: "600",
    marginBottom: "10px",
    fontSize: "16px",
  },
  popupError: {
    color: "#F44336",
    fontWeight: "600",
    marginBottom: "10px",
    fontSize: "16px",
  },
  popupClose: {
    marginTop: "12px",
    padding: "10px 20px",
    background: "linear-gradient(90deg, #ff7b54, #ffb347)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `@keyframes fadeIn { 
    from { opacity: 0; transform: scale(0.9);} 
    to { opacity: 1; transform: scale(1);} 
  }`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `input:focus { 
     border-color: #ff7b54; 
     box-shadow: 0 0 8px rgba(255, 123, 84, 0.8); 
   }`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `button:hover { 
     box-shadow: 0 0 12px rgba(255, 123, 84, 0.7); 
     transform: translateY(-2px);
   }`,
  styleSheet.cssRules.length
);
