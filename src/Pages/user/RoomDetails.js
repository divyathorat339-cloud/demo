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
      if (data) {
        setRoom({ id, ...data });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (!room) {
    return <p style={{ textAlign: "center" }}>Room not found</p>;
  }

  const handleBookNow = () => {
    if (auth.currentUser) {
      navigate(`/book/${room.id}`);
    } else {
      navigate("/login", { state: { from: `/book/${room.id}` } });
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          padding: "60px 20px",
          background: "linear-gradient(120deg,#fdfbfb,#ebedee)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "40px auto",
            background: "#fff",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            transition: "transform 0.3s",
          }}
        >
          {/* ✅ Multiple Images Grid */}
          {room.images?.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "10px",
                padding: "10px",
                background: "#fafafa",
              }}
            >
              {room.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Room ${i}`}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              ))}
            </div>
          )}

          <div style={{ padding: "25px" }}>
            {/* Room Name */}
            <h2
              style={{
                marginBottom: "15px",
                color: "#222",
                fontSize: "2rem",
                background: "linear-gradient(90deg,#43e97b,#38f9d7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              {room.roomName}
            </h2>

            {/* ✅ Rating Stars */}
            <p style={{ fontSize: "16px", margin: "8px 0", color: "#444" }}>
              ⭐ <strong>Rating:</strong>{" "}
              <span style={{ color: "#f39c12" }}>
                {"★".repeat(room.rating || 0)}
              </span>{" "}
              <span style={{ color: "#777" }}>({room.rating || "No rating"})</span>
            </p>

            {/* ✅ Room Info */}
            <p style={{ margin: "8px 0", fontSize: "16px" }}>
              💰 <strong>Price:</strong>{" "}
              <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                ₹ {room.price} / night
              </span>
            </p>

            <p style={{ margin: "8px 0", fontSize: "16px" }}>
              🏷️ <strong>Type:</strong>{" "}
              <span
                style={{
                  background: "#e3fcef",
                  color: "#2ecc71",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {room.type}
              </span>
            </p>

            <p style={{ margin: "8px 0", fontSize: "16px" }}>
              🛏️ <strong>Beds:</strong>{" "}
              <span
                style={{
                  background: "#fcefee",
                  color: "#e74c3c",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {room.beds}
              </span>
            </p>

            <p style={{ margin: "8px 0", fontSize: "16px" }}>
              📍 <strong>Location:</strong>{" "}
              <span style={{ color: "#2980b9", fontWeight: "500" }}>
                {room.location || "Not specified"}
              </span>
            </p>

            {/* ✅ Availability */}
            <p style={{ margin: "8px 0", fontSize: "16px" }}>
              📌 <strong>Status:</strong>{" "}
              <span
                style={{
                  color: room.availability === "Available" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {room.availability}
              </span>
            </p>

            {/* ✅ Description */}
            <p
              style={{
                margin: "12px 0",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#555",
              }}
            >
              📖 <strong>Description:</strong> {room.description || "No description available."}
            </p>

            {/* ✅ Amenities as tags */}
            <div style={{ margin: "12px 0" }}>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                ✨ <strong>Amenities:</strong>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(room.amenities ? room.amenities.split(",") : ["Standard facilities"]).map(
                  (amenity, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#f0f9ff",
                        color: "#3498db",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      }}
                    >
                      {amenity.trim()}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* ✅ Book Button */}
            <button
              style={{
                marginTop: "25px",
                padding: "14px 20px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(90deg,#43e97b,#38f9d7)",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
                fontSize: "17px",
                boxShadow: "0 6px 12px rgba(56,249,215,0.4)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={handleBookNow}
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
