// src/Pages/user/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import { ref as dbRef, onValue, push } from "firebase/database";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import QRCode from "react-qr-code";
import bgImage from "../../image/bgg8.jpg";
export default function BookingForm() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    paymentMethod: "offline",
  });

  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  useEffect(() => {
    const roomRef = dbRef(database, `rooms/${id}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoom({ id, ...data });
      }
      setLoading(false);
    });
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setPopup({
        show: true,
        type: "error",
        message: "📱 Please enter a valid 10-digit phone number.",
      });

      setTimeout(() => {
        setPopup({ show: false, type: "", message: "" });
      }, 2500);
      return;
    }
    try {
      const bookingRef = dbRef(database, "bookings");
      const newBooking = {
        roomId: id,
        roomName: room.roomName,
        price: room.price,
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      const newRef = await push(bookingRef, newBooking);

      setPopup({
        show: true,
        type: "success",
        message: "🎉 Booking Successful! Thank you for booking with us.",
      });

      setTimeout(() => {
        setPopup({ show: false, type: "", message: "" });
        navigate(`/booking-success/${newRef.key}`, { state: newBooking });
      }, 2500);
    } catch (error) {
      setPopup({
        show: true,
        type: "error",
        message: "❌ Booking Failed. Please try again!",
      });

      setTimeout(() => {
        setPopup({ show: false, type: "", message: "" });
      }, 2500);
    }
  };
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!room) return <p style={{ textAlign: "center" }}>Room not found</p>;
  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        <div style={formCard}>
          <h2 style={titleStyle}>Booking for {room.roomName}</h2>
          <p style={priceStyle}>₹{room.price} / night</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
              maxLength="10"
            />

            <label style={labelStyle}>Check-in Date</label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>Check-out Date</label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>Guests</label>
            <input
              type="number"
              name="guests"
              min="1"
              value={formData.guests}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label style={labelStyle}>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="offline">💵 Cash on Arrival</option>
              <option value="qr">📲 UPI / QR Code</option>
            </select>

            {formData.paymentMethod === "qr" && (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <p>Scan & Pay via UPI</p>
                <QRCode value="upi://pay?pa=yourupiid@upi&pn=HotelName&am=500" />
                <p style={{ fontSize: "12px", color: "gray" }}>
                  (Use any UPI app to scan & pay)
                </p>
              </div>
            )}

            <button type="submit" style={buttonStyle}>
              Confirm Booking
            </button>
          </form>
        </div>
      </div>

      {popup.show && (
        <div style={popupOverlay}>
          <div
            style={{
              ...popupBox,
              borderTop:
                popup.type === "success"
                  ? "6px solid #28a745"
                  : "6px solid #dc3545",
            }}
          >
            <p>{popup.message}</p>
          </div>
        </div>
      )}
     <Footer />
     {/* ✨ Focus Effects CSS */}
      <style>
        {`
          input:focus, select:focus {
            border: 1px solid #43e97b;
            box-shadow: 0 0 6px rgba(67,233,123,0.6);
            background: #fff;
          }
        `}
      </style>
    </>
  );
}
const formCard = {
  width: "100%",
  maxWidth: "480px",
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(12px)",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
};
const titleStyle = {
  marginBottom: "10px",
  textAlign: "center",
  fontSize: "24px",
  fontWeight: "700",
  color: "#222",
};
const priceStyle = {
  textAlign: "center",
  marginBottom: "25px",
  fontSize: "18px",
  fontWeight: "600",
  color: "#444",
};
const inputStyle = {
  width: "95%",
  padding: "11px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "15px",
  transition: "all 0.3s ease",
  background: "#f9f9f9",
};
const labelStyle = {
  fontWeight: "600",
  marginBottom: "6px",
  display: "block",
  color: "#333",
};
const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #43e97b, #38f9d7)",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease",
};
const popupOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const popupBox = {
  background: "#fff",
  padding: "20px 35px",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
};
