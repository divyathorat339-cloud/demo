import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { ref, push } from "firebase/database";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import bgImage from "../../image/BG1.jpg";
import { FiMail, FiUser, FiMessageSquare } from "react-icons/fi";
export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [status, setStatus] = useState("idle"); 
  const [showPopup, setShowPopup] = useState(false); 
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields!");
      return;
    }
    try {
      setStatus("sending");
      const contactRef = ref(db, "contacts");
      await push(contactRef, form);

      setForm({ name: "", email: "", message: "" });
      setStatus("sent");
      setShowPopup(true); 
    } catch (error) {
      alert("Failed to send message!");
      setStatus("idle");
    }
  };
  const inputStyle = {
    width: "100%",
    padding: "12px 12px 12px 40px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    transition: "0.3s",
  };
  const handleFocus = (e) => {
    e.target.style.borderColor = "#ff7b54";
    e.target.style.boxShadow = "0 0 8px rgba(255,123,84,0.5)";
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = "#ccc";
    e.target.style.boxShadow = "none";
  };
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px 20px",
          minHeight: "70vh",
        }}
      >
        {/* Card Container */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "45px 30px",
            borderRadius: "15px",
            width: "100%",
            maxWidth: "500px", 
            marginTop: "80px",

            textAlign: "left",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: hovered
              ? "0 20px 35px rgba(0,0,0,0.3)"
              : "0 10px 25px rgba(0,0,0,0.25)",
            transform: loaded
              ? hovered
                ? "translateY(-5px)"
                : "translateY(0)"
              : "translateY(50px)",
            opacity: loaded ? 1 : 0,
            transition: "all 0.5s ease-out",
          }}
        >
          <h2
            style={{
              marginBottom: "30px",
              color: "#222",
              fontSize: "2rem",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Get in Touch
          </h2>

          {/* Form Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Name */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <FiUser style={{ position: "absolute", left: "12px", color: "#888" }} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <FiMail style={{ position: "absolute", left: "12px", color: "#888" }} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputStyle}
              />
            </div>

            {/* Message */}
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
              <FiMessageSquare style={{ position: "absolute", left: "12px", top: "12px", color: "#888" }} />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ ...inputStyle, height: "130px", paddingTop: "14px", resize: "none" }}
              />
            </div>
          </div>

          {/* Send Button */}
          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <button
              onClick={handleSubmit}
              disabled={status === "sending"}
              style={{
                padding: "14px 35px",
                background: "linear-gradient(90deg, #ff7b54, #ffb347)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "600",
                transition: "0.3s",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              }}
              onMouseOver={(e) =>
                (e.target.style.background =
                  "linear-gradient(90deg, #ff6a3d, #ffaa2b)")
              }
              onMouseOut={(e) =>
                (e.target.style.background =
                  "linear-gradient(90deg, #ff7b54, #ffb347)")
              }
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Popup Window */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px 40px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              textAlign: "center",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#28a745" }}>
              ✅ Message Sent Successfully!
            </h3>
            <button
              onClick={() => {
                setShowPopup(false);
                setStatus("idle");
              }}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                background: "linear-gradient(90deg, #ff7b54, #ffb347)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      { <Footer /> }
    </div>
  );
}
