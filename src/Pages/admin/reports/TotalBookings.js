import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";

export default function TotalBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const bookingsRef = ref(database, "bookings");
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      setBookings(data ? Object.values(data) : []);
    });
  }, []);

  const containerStyle = {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  };

  const headingStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
  };

  const totalStyle = {
    fontSize: "18px",
    marginBottom: "16px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
  };

  const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f0f0f0",
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "center",
  };

  const noBookingStyle = {
    color: "#888",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>📖 Total Bookings</h1>
      <p style={totalStyle}>
        Total Bookings: <b>{bookings.length}</b>
      </p>

      {bookings.length === 0 ? (
        <p style={noBookingStyle}>No bookings found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
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
              <tr key={i}>
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
