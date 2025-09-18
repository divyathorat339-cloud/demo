// src/Pages/user/BookingSuccess.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { database, auth } from "../../firebase";
import { ref as dbRef, push, set } from "firebase/database";

export default function BookingSuccess() {
  const location = useLocation();
  const { bookingId: paramBookingId } = useParams();
  const booking = location.state;
  const navigate = useNavigate();

  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [savedBookingId, setSavedBookingId] = useState(paramBookingId || null);

  const billRef = useRef();

  // Save booking into Firebase
  useEffect(() => {
    if (booking) {
      const user = auth.currentUser;
      if (!user) return;

      if (!savedBookingId) {
        const newBookingRef = push(dbRef(database, "bookings"));
        set(newBookingRef, {
          ...booking,
          userId: user.uid,
          createdAt: Date.now(),
        })
          .then(() => setSavedBookingId(newBookingRef.key))
          .catch((err) => console.error("🔥 Error saving booking:", err));
      }
    }
  }, [booking, savedBookingId]);

  if (!booking) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>No booking found.</h2>
      </div>
    );
  }

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("⚠️ Please login to submit a review.");
        setSubmitting(false);
        return;
      }

      const realBookingId = savedBookingId || paramBookingId;
      if (!realBookingId) {
        alert("⚠️ Booking ID missing, cannot submit review.");
        setSubmitting(false);
        return;
      }

      const reviewData = {
        bookingId: realBookingId,
        userId: user.uid,
        name: booking?.name || "",
        hotelName: booking?.hotelName || "Unknown Hotel",
        roomName: booking?.roomName || booking?.room || "",
        rating: review.rating || 0,
        comment: review.comment || "",
        createdAt: Date.now(),
      };

      const newReviewRef = push(dbRef(database, "reviews/" + realBookingId));
      await set(newReviewRef, reviewData);

      alert("✅ Review submitted successfully!");
      setReview({ rating: 0, comment: "" });
    } catch (err) {
      console.error("🔥 Error saving review:", err);
      alert("❌ Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Print Bill
  const handlePrint = () => {
    const printContent = billRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write(`
      <html>
        <head>
          <title>Booking Invoice</title>
          <style>
            body { font-family: 'Poppins', 'Segoe UI', sans-serif; background: #f5f6fa; padding: 20px; }
            .invoice-box {
              max-width: 800px;
              margin: auto;
              background: #fff;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              color: #2c3e50;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
            }
            .invoice-header img {
              height: 60px;
            }
            .invoice-header h1 {
              margin: 0;
              font-size: 28px;
              color: #e74c3c;
            }
            .invoice-header p {
              margin: 4px 0 0;
              color: #7f8c8d;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table th {
              background: #e74c3c;
              color: #fff;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            table td {
              padding: 12px;
              border-bottom: 1px solid #f1f1f1;
            }
            table tr:nth-child(even) td {
              background: #f9f9f9;
            }
            .total {
              font-size: 18px;
              font-weight: 700;
              color: #e74c3c;
              text-align: right;
            }
            .invoice-footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #95a5a6;
            }
            @media print {
              body { background: #fff; }
              .invoice-box { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="invoice-header">
              <div>
                <h1>Hotel Booking</h1>
                <p>Invoice</p>
              </div>
              <img src="https://i.ibb.co/6mZ7v9f/logo.png" alt="Hotel Logo" />
            </div>
            ${printContent}
            <div class="invoice-footer">
              Thank you for choosing our hotel. We hope to see you again!
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // Styles for form
  const labelStyle = { fontWeight: "bold", fontSize: "14px", color: "#2c3e50", display: "block", marginBottom: "6px" };
  const inputStyle = { width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", marginTop: "4px" };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🎉 Booking Confirmed!</h2>

        {/* Attractive Bill Section */}
        <div
          ref={billRef}
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", color: "#e74c3c" }}>Hotel Booking</h1>
              <p style={{ margin: "4px 0 0", color: "#7f8c8d" }}>Invoice</p>
            </div>
            <img src="https://i.ibb.co/6mZ7v9f/logo.png" alt="Hotel Logo" style={{ height: "60px" }} />
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Booking ID</td><td>{savedBookingId || paramBookingId}</td></tr>
              <tr><td>Name</td><td>{booking?.name || ""}</td></tr>
              <tr><td>Email</td><td>{booking?.email || ""}</td></tr>
              <tr><td>Hotel</td><td>{booking?.hotelName || "Unknown Hotel"}</td></tr>
              <tr><td>Room</td><td>{booking?.roomName || booking?.room || ""}</td></tr>
              <tr><td>Check-in</td><td>{booking?.checkIn || ""}</td></tr>
              <tr><td>Check-out</td><td>{booking?.checkOut || ""}</td></tr>
              <tr className="total"><td colSpan="2" style={{ textAlign: "right", fontSize: "18px", fontWeight: "700", color: "#e74c3c" }}>Total: ₹{booking?.totalPrice || booking?.price || 0}</td></tr>
            </tbody>
          </table>

          <div style={{ textAlign: "center", marginTop: "30px", color: "#95a5a6", fontSize: "14px" }}>
            Thank you for choosing our hotel. We hope to see you again!
          </div>
        </div>

        {/* Print Button */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={handlePrint}
            style={{
              background:  "#e64a19",
              color: "#fff",
              padding: "12px 28px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
          >
            🖨️ Print Bill
          </button>
        </div>

        {/* Review Section */}
        <div style={{ marginTop: "28px", borderTop: "2px solid #f1f1f1", paddingTop: "16px" }}>
          <h3 style={{ marginBottom: "12px", color: "#2c3e50", fontSize: "18px" }}>📝 Write a Review</h3>

          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Rating</label>
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReview({ ...review, rating: star })}
                    style={{
                      border: "1px solid #e1e1e1",
                      background: review.rating >= star ? "#ffeaa7" : "#fff",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "16px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    {review.rating >= star ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>
                Comment
                <textarea
                  placeholder="Tell us about your stay..."
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "linear-gradient( #e64a19)",
                  color: "#fff",
                  padding: "12px 22px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  opacity: submitting ? 0.8 : 1,
                }}
              >
                {submitting ? "Saving..." : "Submit Review"}
              </button>

              {/* Go to Homepage Button */}
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  background: "#2ecc71",
                  color: "#fff",
                  padding: "12px 22px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                🏠 Go to Homepage
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
