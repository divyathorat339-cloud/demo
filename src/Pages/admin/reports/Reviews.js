// src/Pages/user/Reviews.jsx
import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const reviewsRef = ref(database, "reviews");

    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reviewsArray = [];

        // Flatten reviews from all bookings
        Object.keys(data).forEach((bookingId) => {
          const bookingReviews = data[bookingId];
          Object.keys(bookingReviews).forEach((reviewKey) => {
            reviewsArray.push({
              id: reviewKey,
              bookingId,
              ...bookingReviews[reviewKey],
            });
          });
        });

        setReviews(reviewsArray);
      } else {
        setReviews([]);
      }
    });
  }, []);

  const containerStyle = { padding: "24px", fontFamily: "Arial, sans-serif" };
  const headingStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  };
  const thStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "black",
    color: "#fff",
    textAlign: "left",
  };
  const tdStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
  };
  const noDataStyle = { textAlign: "center", color: "#888" };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>⭐ Customer Reviews</h1>

      {reviews.length === 0 ? (
        <p style={noDataStyle}>No reviews found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Booking ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Hotel</th>
                <th style={thStyle}>Room</th>
                <th style={thStyle}>Rating</th>
                <th style={thStyle}>Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, i) => (
                <tr
                  key={r.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#f9f9f9" : "#fff")
                  }
                >
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{r.bookingId}</td>
                  <td style={tdStyle}>{r.name || "N/A"}</td>
                  <td style={tdStyle}>{r.hotelName || "N/A"}</td>
                  <td style={tdStyle}>{r.roomName || r.room || "N/A"}</td>
                  <td style={tdStyle}>{r.rating || "N/A"} ⭐</td>
                  <td style={tdStyle}>{r.comment || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
