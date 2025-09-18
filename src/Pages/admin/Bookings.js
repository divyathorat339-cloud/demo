// src/Pages/admin/Bookings.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, push, onValue, remove, update } from "firebase/database";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHotel,
  FaDoorOpen,
  FaCalendarCheck,
  FaCalendarTimes,
  FaTimes,
} from "react-icons/fa";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("online");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hotel: "",
    room: "",
    checkIn: "",
    checkOut: "",
  });
  const [editId, setEditId] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);

  useEffect(() => {
    const bookingsRef = ref(db, "bookings");
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setBookings(bookingsArray);
      } else {
        setBookings([]);
      }
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      const bookingRef = ref(db, "bookings/" + editId);
      update(bookingRef, { ...formData })
        .then(() => {
          alert("Booking updated successfully!");
          setFormData({
            name: "",
            email: "",
            phone: "",
            hotel: "",
            room: "",
            checkIn: "",
            checkOut: "",
          });
          setEditId(null);
        })
        .catch((err) => alert("Error: " + err.message));
    } else {
      const newBooking = {
        ...formData,
        source: "admin",
        createdAt: new Date().toISOString(),
      };
      const bookingsRef = ref(db, "bookings");
      push(bookingsRef, newBooking)
        .then(() => {
          alert("Booking saved successfully!");
          setFormData({
            name: "",
            email: "",
            phone: "",
            hotel: "",
            room: "",
            checkIn: "",
            checkOut: "",
          });
        })
        .catch((err) => alert("Error: " + err.message));
    }
  };

  // ✅ Show confirm before delete
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (confirmDelete) {
      const bookingRef = ref(db, "bookings/" + id);
      remove(bookingRef)
        .then(() => alert("Booking deleted!"))
        .catch((err) => alert("Error: " + err.message));
    }
  };

  const handleEdit = (booking) => {
    setFormData({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      hotel: booking.hotel,
      room: booking.room,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    });
    setEditId(booking.id);
  };

  const onlineBookings = bookings.filter((b) => b.source !== "admin");
  const adminBookings = bookings.filter((b) => b.source === "admin");

  return (
    <div style={{ padding: "20px" }}>
      <h2>📌 Hotel Bookings</h2>

      {/* Tabs */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setActiveTab("online")}
          style={{
            padding: "10px",
            marginRight: "10px",
            background: activeTab === "online" ? "#42a5f5" : "#e5e7eb",
            color: activeTab === "online" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Online Bookings
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          style={{
            padding: "10px",
            background: activeTab === "admin" ? "#42a5f5" : "#e5e7eb",
            color: activeTab === "admin" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Admin Bookings
        </button>
      </div>

      {/* Online Bookings */}
      {activeTab === "online" && (
        <div style={{ marginTop: "20px" }}>
          <h3>🌐 Online Bookings</h3>
          {onlineBookings.length === 0 ? (
            <p>No online bookings yet.</p>
          ) : (
            <table
              border="1"
              cellPadding="10"
              style={{ width: "100%", marginTop: "10px" }}
            >
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {onlineBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.email}</td>
                    <td>{b.phone}</td>
                    <td>{b.hotel}</td>
                    <td>{b.room}</td>
                    <td>{b.checkIn}</td>
                    <td>{b.checkOut}</td>
                    <td>
                      <button
                        onClick={() => setViewBooking(b)}
                        style={{
                          marginRight: "5px",
                          background: "#42a5f5",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        View Details
                      </button>
                      {/* ❌ Removed Edit button for Online bookings */}
                      <button
                        onClick={() => handleDelete(b.id)}
                        style={{
                          background: "red",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Admin Bookings */}
      {activeTab === "admin" && (
        <div style={{ marginTop: "20px" }}>
          <h3>🛠 Admin Bookings</h3>

          {/* Manual Booking Form */}
          <div style={{ marginTop: "20px" }}>
            <h4>{editId ? "✏ Edit Booking" : "➕ Add Manual Booking"}</h4>
            <form
              onSubmit={handleSubmit}
              style={{ display: "grid", gap: "10px", maxWidth: "400px" }}
            >
              <input
                type="text"
                name="name"
                placeholder="Guest Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Guest Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="hotel"
                placeholder="Hotel Name"
                value={formData.hotel}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="room"
                placeholder="Room Number / Type"
                value={formData.room}
                onChange={handleChange}
                required
              />
              <label>Check-In</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
              <label>Check-Out</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                style={{
                  padding: "10px",
                  background: editId ? "orange" : "#42a5f5",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {editId ? "Update Booking" : "Save Booking"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      hotel: "",
                      room: "",
                      checkIn: "",
                      checkOut: "",
                    });
                  }}
                  style={{
                    padding: "10px",
                    background: "gray",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Admin Bookings List */}
          <div style={{ marginTop: "40px" }}>
            <h4>📋 Existing Admin Bookings</h4>
            {adminBookings.length === 0 ? (
              <p>No manual bookings yet.</p>
            ) : (
              <table
                border="1"
                cellPadding="10"
                style={{ width: "100%", marginTop: "10px" }}
              >
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Hotel</th>
                    <th>Room</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.name}</td>
                      <td>{b.email}</td>
                      <td>{b.phone}</td>
                      <td>{b.hotel}</td>
                      <td>{b.room}</td>
                      <td>{b.checkIn}</td>
                      <td>{b.checkOut}</td>
                      <td>
                        <button
                          onClick={() => setViewBooking(b)}
                          style={{
                            marginRight: "5px",
                            background: "#42a5f5",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(b)}
                          style={{
                            marginRight: "5px",
                            background: "orange",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          style={{
                            background: "red",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewBooking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
              animation: "scaleUp 0.3s ease-in-out",
            }}
          >
            <h3
              style={{
                marginBottom: "15px",
                textAlign: "center",
                color: "#42a5f5",
              }}
            >
              Booking Details
            </h3>
            <p>
              <FaUser /> <strong>Name:</strong> {viewBooking.name}
            </p>
            <p>
              <FaEnvelope /> <strong>Email:</strong> {viewBooking.email}
            </p>
            <p>
              <FaPhone /> <strong>Phone:</strong> {viewBooking.phone}
            </p>
            <p>
              <FaHotel /> <strong>Hotel:</strong> {viewBooking.hotel}
            </p>
            <p>
              <FaDoorOpen /> <strong>Room:</strong> {viewBooking.room}
            </p>
            <p>
              <FaCalendarCheck /> <strong>Check-In:</strong>{" "}
              {viewBooking.checkIn}
            </p>
            <p>
              <FaCalendarTimes /> <strong>Check-Out:</strong>{" "}
              {viewBooking.checkOut}
            </p>
            <button
              onClick={() => setViewBooking(null)}
              style={{
                marginTop: "15px",
                background: "red",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                width: "100%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <FaTimes /> Close
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
          }
          @keyframes scaleUp {
            from {transform: scale(0.8);}
            to {transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
}
