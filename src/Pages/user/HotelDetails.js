// src/Pages/user/HotelDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const hotelRef = ref(db, `hotels/${id}`);
    const unsubscribe = onValue(hotelRef, (snapshot) => {
      setHotel(snapshot.val());
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const renderStars = (count) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        style={{
          color: s <= count ? "#FFD700" : "#ccc",
          fontSize: "1.3rem",
          marginRight: "2px",
        }}
      >
        ★
      </span>
    ));

  const NAVBAR_HEIGHT = 70;
  const FOOTER_HEIGHT = 60;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg,#f5f7fa,#e4edf9)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Navbar />

      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: NAVBAR_HEIGHT,
            fontSize: "1.3rem",
            color: "#555",
          }}
        >
          Loading hotel details...
        </div>
      ) : hotel ? (
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            margin: "30px auto",
            borderRadius: "25px",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
            paddingTop: NAVBAR_HEIGHT,
            boxSizing: "border-box",
            height: `calc(100vh - ${NAVBAR_HEIGHT + FOOTER_HEIGHT}px)`,
            maxWidth: "1400px",
            background: "#fff",
            animation: "fadeIn 0.6s ease-in",
          }}
        >
          {/* Image Section */}
          <div style={{ flex: 1.2, position: "relative" }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: "25px 0 0 25px",
                position: "relative",
              }}
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s, filter 0.5s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.filter = "brightness(0.95)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              />
              {/* subtle overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.15))",
                }}
              ></div>
            </div>
          </div>

          {/* Details Section */}
          <div
            style={{
              flex: 1.5,
              padding: "40px 50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#bbb transparent",
            }}
          >
            <style>
              {`
              /* Modern scrollbar */
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background-color: #bbb;
                border-radius: 10px;
              }
              @keyframes fadeIn {
                0% {opacity:0; transform: translateY(15px);}
                100% {opacity:1; transform: translateY(0);}
              }
              `}
            </style>

            <div>
              <h1
                style={{
                  fontSize: "2.3rem",
                  color: "#222",
                  marginBottom: "15px",
                  fontWeight: "700",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.08)",
                }}
              >
                {hotel.name}
              </h1>
              <p
                style={{
                  color: "#555",
                  marginBottom: "15px",
                  fontSize: "1.1rem",
                  letterSpacing: "0.5px",
                }}
              >
                📍 {hotel.location}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: "#eef5ff",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontWeight: "500",
                    color: "#333",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <b>Room:</b> {hotel.category}
                </span>
                <span
                  style={{
                    background: "#eef5ff",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontWeight: "500",
                    color: "#333",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <b>Beds:</b> {hotel.beds}
                </span>
                <span
                  style={{
                    background: "linear-gradient(90deg,#ff9966,#ff5e62)",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    color: "#fff",
                    fontWeight: "600",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  ₹{hotel.price}/night
                </span>
              </div>

              <p style={{ marginBottom: "15px", fontSize: "1.05rem" }}>
                <b>Amenities:</b> {hotel.amenities}
              </p>
              <p style={{ marginBottom: "15px", fontSize: "1.05rem" }}>
                <b>Check-in:</b> {hotel.checkin} | <b>Check-out:</b> {hotel.checkout}
              </p>
              <p style={{ marginBottom: "15px", fontSize: "1.05rem" }}>
                <b>Rating:</b> {renderStars(hotel.rating)} ({hotel.rating})
              </p>
              <p
                style={{
                  marginBottom: "15px",
                  lineHeight: "1.7rem",
                  fontSize: "1.05rem",
                  color: "#444",
                }}
              >
                <b>Description:</b> {hotel.description}
              </p>
              <p style={{ marginBottom: "15px", fontSize: "1.05rem" }}>
                <b>Contact:</b> {hotel.contactPhone} | {hotel.contactEmail}
              </p>

              {hotel.mapUrl && (
                <a
                  href={hotel.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    color: "#007bff",
                    fontWeight: "500",
                    textDecoration: "none",
                    fontSize: "1.05rem",
                  }}
                >
                  📍 View on Google Maps
                </a>
              )}
            </div>

            <button
              style={{
                marginTop: "25px",
                padding: "18px 40px",
                background: "linear-gradient(#ff5722)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                fontSize: "1.15rem",
                fontWeight: "600",
                boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
                alignSelf: "flex-start",
              }}
              onClick={() => navigate(`/rooms/${id}`)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              View Rooms
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: NAVBAR_HEIGHT,
            fontSize: "1.3rem",
            color: "#555",
          }}
        >
          Hotel not found.
        </div>
      )}

      <Footer />
    </div>
  );
}
