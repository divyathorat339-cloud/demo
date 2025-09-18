import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const bookingsRef = ref(database, "bookings");
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      setBookings(data ? Object.values(data) : []);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        📋 All Bookings
      </h1>

      <p
        style={{
          fontSize: "18px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Total Records: <b>{bookings.length}</b>
      </p>

      {bookings.length === 0 ? (
        <p style={{ color: "gray", textAlign: "center" }}>
          No booking records found.
        </p>
      ) : (
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
              <th style={thStyle}>User</th>
              <th style={thStyle}>Hotel</th>
              <th style={thStyle}>Room</th>
              <th style={thStyle}>Check-In</th>
              <th style={thStyle}>Check-Out</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr
                key={i}
                style={{
                  textAlign: "center",
                  backgroundColor: i % 2 === 0 ? "#fafafa" : "white",
                }}
              >
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{b.userName}</td>
                <td style={tdStyle}>{b.hotelName}</td>
                <td style={tdStyle}>{b.roomType}</td>
                <td style={tdStyle}>{b.checkInDate}</td>
                <td style={tdStyle}>{b.checkOutDate}</td>
                <td style={tdStyle}>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ✅ Reusable inline styles
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
