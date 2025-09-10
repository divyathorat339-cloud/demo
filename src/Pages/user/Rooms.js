// src/Pages/user/Rooms.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase"; // ✅ include auth
import { ref, onValue } from "firebase/database";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Rooms() {
  const { hotelId } = useParams(); // ✅ get hotelId from URL
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const roomRef = ref(db, "rooms");
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allRooms = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
        }));
        // ✅ filter rooms only for this hotel
        const hotelRooms = allRooms.filter((room) => room.hotelId === hotelId);
        setRooms(hotelRooms);
      } else {
        setRooms([]);
      }
      setLoading(false);
    });
  }, [hotelId]);

  // ✅ booking button handler
  const handleBooking = (roomId) => {
    if (auth.currentUser) {
      navigate(`/book/${roomId}`); // ✅ FIXED to match App.js route
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh" }}>
      <Navbar />

      <div
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "20px",
            textAlign: "center",
            color: "#222",
          }}
        >
          🏨 Rooms Available
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
            Loading rooms...
          </p>
        ) : rooms.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {rooms.map((room) => (
              <div
                key={room.id}
                style={{
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {room.images && room.images.length > 0 && (
                  <img
                    src={room.images[0]}
                    alt={room.roomName}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "15px",
                    }}
                  />
                )}

                <h3 style={{ fontSize: "1.3rem", marginBottom: "10px" }}>
                  {room.roomName}
                </h3>
                <p style={{ color: "#555", marginBottom: "8px" }}>
                  <b>💰 Price:</b>{" "}
                  <span style={{ fontWeight: "600", color: "#ff5722" }}>
                    ₹{room.price}
                  </span>{" "}
                  / night
                </p>
                <p style={{ color: "#555", marginBottom: "8px" }}>
                  <b>🏷️ Type:</b> {room.type} | <b>🛏️ Beds:</b> {room.beds}
                </p>
                {room.location && (
                  <p style={{ color: "#555", marginBottom: "8px" }}>
                    📍 {room.location}
                  </p>
                )}
                <p style={{ color: "#555", marginBottom: "8px" }}>
                  ⭐ <b>Rating:</b> {room.rating ?? "N/A"}
                </p>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  📝 {room.description}
                </p>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  ✨ {room.amenities}
                </p>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  📌 Status: {room.availability}
                </p>

                {/* ✅ Book Now Button */}
                <button
                  onClick={() => handleBooking(room.id)}
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#ff5722",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e64a19")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#ff5722")
                  }
                >
                  🚀 Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#999" }}>
            No rooms available for this hotel.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}
