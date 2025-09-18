// src/Pages/user/RoomDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database, auth } from "../../firebase";
import { ref as dbRef, onValue } from "firebase/database";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const roomRef = dbRef(database, `rooms/${id}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setRoom({ id, ...data });
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", padding: "100px 0" }}>Loading...</p>;
  if (!room) return <p style={{ textAlign: "center", padding: "100px 0" }}>Room not found</p>;

  const handleBookNow = () => {
    if (auth.currentUser) navigate(`/book/${room.id}`);
    else navigate("/login", { state: { from: `/book/${room.id}` } });
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#f0f4ff,#e8f0fe)",
          paddingTop: "80px",
          paddingBottom: "50px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "40px auto",
            maxWidth: "1400px",
            borderRadius: "25px",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            background: "#fff",
            height: "calc(100vh - 150px)",
          }}
        >
          {/* Left Column: Image Gallery */}
          <div
            style={{
              flex: 1.5,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              padding: "15px",
              background: "#f9faff",
            }}
          >
            {room.images?.length > 0 ? (
              room.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Room ${i}`}
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                    borderRadius: "15px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              ))
            ) : (
              <div style={{ textAlign: "center", width: "100%", color: "#888", fontSize: "1.2rem" }}>
                No images available
              </div>
            )}
          </div>

          {/* Right Column: Room Details */}
          <div
            style={{
              flex: 2,
              padding: "50px 60px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "700",
                  color: "#222",
                  marginBottom: "15px",
                  textShadow: "1px 1px 5px rgba(0,0,0,0.05)",
                }}
              >
                {room.roomName}
              </h1>
              <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "20px" }}>📍 {room.location}</p>

              {/* Info Badges */}
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "25px" }}>
                <span
                  style={{
                    background: "#eef6ff",
                    color: "#1a73e8",
                    padding: "10px 20px",
                    borderRadius: "14px",
                    fontWeight: "500",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  🏷️ {room.type}
                </span>
                <span
                  style={{
                    background: "#eef6ff",
                    color: "#1a73e8",
                    padding: "10px 20px",
                    borderRadius: "14px",
                    fontWeight: "500",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  🛏️ {room.beds} Beds
                </span>
                <span
                  style={{
                    background: "linear-gradient(90deg,#ff9966,#ff5e62)",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "14px",
                    fontWeight: "600",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  ₹{room.price}/night
                </span>
                <span
                  style={{
                    background: room.availability === "Available" ? "#e6ffed" : "#ffe6e6",
                    color: room.availability === "Available" ? "green" : "red",
                    padding: "10px 20px",
                    borderRadius: "14px",
                    fontWeight: "600",
                  }}
                >
                  📌 {room.availability}
                </span>
              </div>

              {/* Room Info */}
              <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
                <b>Amenities:</b> {room.amenities}
              </p>
              <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
                <b>Check-in:</b> {room.checkin} | <b>Check-out:</b> {room.checkout}
              </p>
              <p style={{ marginBottom: "15px", fontSize: "1.1rem", color: "#444", lineHeight: "1.7rem" }}>
                <b>Description:</b> {room.description}
              </p>
              <p style={{ marginBottom: "15px", fontSize: "1.1rem" }}>
                <b>Contact:</b> {room.contactPhone} | {room.contactEmail}
              </p>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              style={{
                marginTop: "30px",
                padding: "18px 50px",
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "#fff",
                background: "linear-gradient(90deg,#ff512f,#dd2476)",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
                alignSelf: "flex-start",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              🚀 Book Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
