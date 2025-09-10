// src/Pages/user/BookingSuccess.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { database, auth } from "../../firebase";
import { ref as dbRef, push, set } from "firebase/database";

export default function BookingSuccess() {
  const location = useLocation();
  const { bookingId: paramBookingId } = useParams();
  const booking = location.state;

  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [savedBookingId, setSavedBookingId] = useState(paramBookingId || null);

  // ✅ Save booking into Firebase when success page loads
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
          .then(() => {
            setSavedBookingId(newBookingRef.key);
          })
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

  // ✅ Submit Review
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

      // ✅ Safe values (prevent undefined errors)
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

      console.log("User:", user.uid);
      console.log("BookingId:", realBookingId);
      console.log("Review Data:", reviewData);

      const newReviewRef = push(dbRef(database, "reviews/" + realBookingId));
      await set(newReviewRef, reviewData);

      alert("✅ Review submitted successfully!");
      setReview({ rating: 0, comment: "" });
    } catch (err) {
      console.error("🔥 Error saving review:", err);
      alert("❌ Failed to submit review. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  // Styles
  const labelStyle = {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#333",
    display: "block",
    marginBottom: "6px",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    marginTop: "4px",
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          🎉 Booking Confirmed!
        </h2>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "12px" }}>Booking Details</h3>
          <p>
            <strong>Booking ID:</strong> {savedBookingId || paramBookingId}
          </p>
          <p>
            <strong>Name:</strong> {booking?.name || ""}
          </p>
          <p>
            <strong>Email:</strong> {booking?.email || ""}
          </p>
          <p>
            <strong>Hotel:</strong> {booking?.hotelName || "Unknown Hotel"}
          </p>
          <p>
            <strong>Room:</strong> {booking?.roomName || booking?.room || ""}
          </p>
          <p>
            <strong>Check-in:</strong> {booking?.checkIn || ""}
          </p>
          <p>
            <strong>Check-out:</strong> {booking?.checkOut || ""}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{booking?.totalPrice || 0}
          </p>
        </div>

        {/* ✅ Review Section */}
        <div
          style={{
            marginTop: "28px",
            borderTop: "2px solid #f1f1f1",
            paddingTop: "16px",
          }}
        >
          <h3 style={{ marginBottom: "12px", color: "#333", fontSize: "18px" }}>
            📝 Write a Review
          </h3>

          <form onSubmit={handleReviewSubmit}>
            {/* Rating */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ ...labelStyle, display: "block" }}>Rating</label>
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

            {/* Comment */}
            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>
                Comment
                <textarea
                  placeholder="Tell us about your stay..."
                  value={review.comment}
                  onChange={(e) =>
                    setReview({ ...review, comment: e.target.value })
                  }
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "linear-gradient(90deg,#43e97b,#38f9d7)",
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
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
