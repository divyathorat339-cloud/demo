import React, { useEffect, useState } from "react";
import { db } from "../../../firebase"; // Use the same db as in user panel
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

export default function TotalHotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const hotelsRef = ref(db, "hotels");
    onValue(hotelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const hotelArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setHotels(hotelArray);
      } else {
        setHotels([]);
      }
    });
  }, []);

  const renderStars = (count) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        style={{
          color: s <= count ? "#FFD700" : "#ddd",
          fontSize: "1rem",
          marginRight: "2px",
        }}
      >
        ★
      </span>
    ));

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        🏨 Total Hotels
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "20px", textAlign: "center" }}>
        Total Hotels: <b>{hotels.length}</b>
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Hotel Name</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Beds</th>
            <th style={thStyle}>Price/Night</th>
            <th style={thStyle}>Amenities</th>
            <th style={thStyle}>Rating</th>
            <th style={thStyle}>Contact</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel, index) => (
            <tr
              key={hotel.id}
              style={{
                textAlign: "center",
                backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
              }}
            >
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>
                {hotel.image ? (
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    style={{ width: "80px", height: "60px", borderRadius: "8px", objectFit: "cover" }}
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td style={tdStyle}>
                <Link to={`/hotel/${hotel.id}`} style={{ textDecoration: "none", color: "#007bff" }}>
                  {hotel.name}
                </Link>
              </td>
              <td style={tdStyle}>{hotel.location || "N/A"}</td>
              <td style={tdStyle}>{hotel.category || "N/A"}</td>
              <td style={tdStyle}>{hotel.beds || "N/A"}</td>
              <td style={{ ...tdStyle, color: "#ff5722", fontWeight: "600" }}>
                ₹{hotel.price || "N/A"}
              </td>
              <td style={tdStyle}>{hotel.amenities || "N/A"}</td>
              <td style={tdStyle}>{renderStars(hotel.rating || 0)}</td>
              <td style={tdStyle}>
                {hotel.contactPhone || "N/A"}
                <br />
                {hotel.contactEmail || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};
