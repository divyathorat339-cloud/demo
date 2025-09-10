// src/Pages/user/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { auth, database } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref as dbRef, onValue, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function MyBookings() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const bookingsRef = dbRef(database, "bookings");
        onValue(bookingsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const userBookings = Object.entries(data)
              .filter(([_, booking]) => booking.userId === currentUser.uid)
              .map(([id, booking]) => ({ id, ...booking }));
            setBookings(userBookings);
          } else {
            setBookings([]);
          }
          setLoading(false);
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const cancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await remove(dbRef(database, `bookings/${bookingId}`));
        alert("Booking cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ marginTop: "100px", padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          My Bookings
        </h2>

        {bookings.length === 0 ? (
          <p style={{ textAlign: "center" }}>No bookings found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "15px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  background: "#fff",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0" }}>{booking.hotelName}</h3>
                <p>
                  <b>Room:</b> {booking.roomName}
                </p>
                <p>
                  <b>Check-In:</b> {booking.checkIn}
                </p>
                <p>
                  <b>Check-Out:</b> {booking.checkOut}
                </p>
                <p>
                  <b>Price:</b> ₹{booking.totalPrice}
                </p>

                <button
                  onClick={() => cancelBooking(booking.id)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    background: "#e63946",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
