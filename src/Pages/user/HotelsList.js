// src/Pages/user/Hotels.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useParams } from "react-router-dom";
import HotelCard from "../../components/HotelCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaSearch } from "react-icons/fa";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const { city } = useParams();

  useEffect(() => {
    const hotelsRef = ref(db, "hotels");
    onValue(hotelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const hotelsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setHotels(hotelsArray);
        setSearchResult(hotelsArray);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (city) {
      setSearchTerm(city);
      handleSearch(city);
    }
  }, [city, hotels]);

  const handleSearch = (term) => {
    const lowerTerm = term.toLowerCase();
    const filtered = hotels.filter(
      (hotel) =>
        hotel.location?.toLowerCase().includes(lowerTerm) ||
        hotel.name?.toLowerCase().includes(lowerTerm)
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
      setSearchResult(hotels);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const matches = hotels.filter(
      (hotel) =>
        hotel.location?.toLowerCase().includes(lowerTerm) ||
        hotel.name?.toLowerCase().includes(lowerTerm)
    );

    setSuggestions(matches.slice(0, 5));
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name || suggestion.location);
    handleSearch(suggestion.name || suggestion.location);
    setSuggestions([]);
  };

  // ✅ Highlight matched keyword
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
          Explore Hotels
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
        <div
          style={{
            marginBottom: "35px",
            display: "flex",
            justifyContent: "center",
          }}
        >
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
              placeholder="Search by city or hotel name..."
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

            {/* ✅ Suggestions Dropdown */}
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
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    {highlightMatch(s.name, searchTerm)} –{" "}
                    <span style={{ color: "#777" }}>
                      {highlightMatch(s.location, searchTerm)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <p>Loading hotels...</p>
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
            {searchResult.map((hotel) => (
              <div
                key={hotel.id}
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
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 15px rgba(0,0,0,0.08)";
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "linear-gradient(90deg, #ff7b54, #ffb347)",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  {hotel.location}
                </span>
                <HotelCard
                  id={hotel.id}
                  name={hotel.name}
                  location={hotel.location}
                  image={hotel.image}
                  price={`₹${hotel.price} / night`}
                />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "18px", color: "#777" }}>
            No hotels found for "{searchTerm}".
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
