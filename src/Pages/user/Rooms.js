// src/Pages/user/Rooms.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { ref, onValue } from "firebase/database";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaSearch } from "react-icons/fa";

export default function Rooms() {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch rooms from Firebase
  useEffect(() => {
    const roomRef = ref(db, "rooms");
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allRooms = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
        }));
        const hotelRooms = allRooms.filter((room) => room.hotelId === hotelId);
        setRooms(hotelRooms);
        setSearchResult(hotelRooms);
      } else {
        setRooms([]);
        setSearchResult([]);
      }
      setLoading(false);
    });
  }, [hotelId]);

  // Search by room name, type, beds, price
  const handleSearch = (term) => {
    const lowerTerm = term.toLowerCase();
    const filtered = rooms.filter(
      (room) =>
        room.roomName?.toLowerCase().includes(lowerTerm) ||
        room.type?.toLowerCase().includes(lowerTerm) ||
        room.beds?.toString().includes(lowerTerm) ||
        room.price?.toString().includes(lowerTerm.replace(/[^0-9]/g, ""))
    );
    setSearchResult(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchTerm);
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSuggestions([]);
      setSearchResult(rooms);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const matches = rooms.filter(
      (room) =>
        room.roomName?.toLowerCase().includes(lowerTerm) ||
        room.type?.toLowerCase().includes(lowerTerm) ||
        room.beds?.toString().includes(lowerTerm) ||
        room.price?.toString().includes(lowerTerm.replace(/[^0-9]/g, ""))
    );
    setSuggestions(matches.slice(0, 5));
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.roomName);
    handleSearch(suggestion.roomName);
    setSuggestions([]);
  };

  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <strong key={index} style={{ color: "#ff7b54" }}>
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const handleViewDetails = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ padding: "30px 20px", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "2.2rem",
            marginBottom: "12px",
            color: "#222",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          Available Rooms
        </h2>
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, #ff7b54, #ffb347)",
            borderRadius: "2px",
            margin: "0 auto 25px auto",
          }}
        />

        {/* 🔍 Search Bar */}
        <div style={{ marginBottom: "35px", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "320px" }}>
            <FaSearch
              onClick={() => handleSearch(searchTerm)}
              style={{
                position: "absolute",
                top: "50%",
                left: "15px",
                transform: "translateY(-50%)",
                color: "#999",
                fontSize: "16px",
                cursor: "pointer",
              }}
            />
            <input
              type="text"
              placeholder="Search by room name, type, beds, or price..."
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                padding: "12px 18px 12px 42px",
                borderRadius: "30px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
            />
            {suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "105%",
                  left: "0",
                  width: "100%",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                  listStyle: "none",
                  padding: "6px 0",
                  margin: "6px 0 0 0",
                  zIndex: "1000",
                  textAlign: "left",
                }}
              >
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => handleSuggestionClick(s)}
                    style={{
                      padding: "10px 15px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#333",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    {highlightMatch(s.roomName, searchTerm)} – <span style={{ color: "#777" }}>{highlightMatch(s.type, searchTerm)}</span> – <span style={{ color: "#ff7b54" }}>₹{s.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <p>Loading rooms...</p>
        ) : searchResult.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "26px",
              maxWidth: "1250px",
              margin: "0 auto",
              padding: "10px",
            }}
          >
            {searchResult.map((room) => (
              <div
                key={room.id}
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.08)";
                }}
              >
                {room.images?.length > 0 && (
                  <img
                    src={room.images[0]}
                    alt={room.roomName}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                )}
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#222" }}>
                    {room.roomName}
                  </h3>
                  <p style={{ fontSize: "16px", marginBottom: "6px" }}>
                    🏷️ <strong>Type:</strong> {room.type} | 🛏️ <strong>Beds:</strong> {room.beds}
                  </p>
                  <p style={{ fontSize: "16px", marginBottom: "6px" }}>
                    💰 <strong>Price:</strong>{" "}
                    <span style={{ color: "#ff7b54", fontWeight: "bold" }}>₹{room.price}</span>
                  </p>
                  <p style={{ fontSize: "16px", marginBottom: "6px" }}>
                    📌 <strong>Status:</strong> {room.availability}
                  </p>
                  <button
                    onClick={() => handleViewDetails(room.id)}
                    style={{
                      marginTop: "15px",
                      width: "100%",
                      padding: "12px",
                      background: "linear-gradient(#ff5722)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    🔎 View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "18px", color: "#777" }}>
            No rooms found for "{searchTerm}".
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
