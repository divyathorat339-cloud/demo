import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

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
          color: s <= count ? "#FFD700" : "#ddd",
          fontSize: "1.2rem",
          marginRight: "3px",
        }}
      >
        ★
      </span>
    ));

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh" }}>
      <Navbar />

      {/* Wrapper */}
      <div
        style={{
          padding: "60px 20px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
            Loading hotel details...
          </p>
        ) : hotel ? (
          <>
            {/* Hotel Card */}
            <div
              style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                marginBottom: "30px",
                marginTop: "20px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Hotel Image */}
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  marginBottom: "25px",
                  objectFit: "cover",
                  maxHeight: "450px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                }}
              />

              {/* Hotel Title */}
              <h2
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  marginBottom: "8px",
                  color: "#222",
                }}
              >
                {hotel.name}
              </h2>

              <p
                style={{
                  color: "#666",
                  marginBottom: "20px",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                📍 {hotel.location}
              </p>

              {/* Hotel Details */}
              <div style={{ lineHeight: "1.8", fontSize: "1rem" }}>
                <p>
                  🏠 <b>Room:</b> {hotel.category} | 🛏 <b>Beds:</b>{" "}
                  {hotel.beds}
                </p>

                <p>
                  💰 <b>Price:</b>{" "}
                  <span style={{ fontWeight: "700", color: "#ff5722" }}>
                    ₹{hotel.price}
                  </span>{" "}
                  / night
                </p>

                <p>
                  🏊 <b>Amenities:</b> {hotel.amenities}
                </p>

                <p>
                  ⭐ <b>Rating:</b> {renderStars(hotel.rating)} (
                  {hotel.rating})
                </p>

                <p>
                  📝 <b>Description:</b> {hotel.description}
                </p>

                <p>
                  📞 <b>Contact:</b> {hotel.contactPhone} | ✉️{" "}
                  {hotel.contactEmail}
                </p>
              </div>

              {/* CTA Button */}
              <div style={{ marginTop: "30px" }}>
                <Link to={`/rooms/${id}`}>
                  <button
                    style={{
                      padding: "14px 30px",
                      background: "linear-gradient(90deg,#4CAF50,#43a047)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "17px",
                      fontWeight: "600",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.background =
                        "linear-gradient(90deg,#45a049,#388e3c)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.background =
                        "linear-gradient(90deg,#4CAF50,#43a047)")
                    }
                  >
                    View Rooms
                  </button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#999" }}>
            Hotel not found.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}
