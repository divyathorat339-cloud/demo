// src/Pages/admin/Bookings.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, push, onValue, remove, update } from "firebase/database";
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
  const handleDelete = (id) => {
    const bookingRef = ref(db, "bookings/" + id);
    remove(bookingRef)
      .then(() => alert("Booking deleted!"))
      .catch((err) => alert("Error: " + err.message));
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
            background: activeTab === "online" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "online" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Online Bookings
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          style={{
            padding: "10px",
            background: activeTab === "admin" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "admin" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
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
            <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
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

          {/* Manual Booking Form FIRST */}
          <div style={{ marginTop: "20px" }}>
            <h4>{editId ? "✏ Edit Booking" : "➕ Add Manual Booking"}</h4>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
              <input type="text" name="name" placeholder="Guest Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Guest Email" value={formData.email} onChange={handleChange} required />
              <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              <input type="text" name="hotel" placeholder="Hotel Name" value={formData.hotel} onChange={handleChange} required />
              <input type="text" name="room" placeholder="Room Number / Type" value={formData.room} onChange={handleChange} required />
              <label>Check-In</label>
              <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required />
              <label>Check-Out</label>
              <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required />
              <button type="submit" style={{ padding: "10px", background: editId ? "orange" : "green", color: "white", border: "none" }}>
                {editId ? "Update Booking" : "Save Booking"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFormData({ name: "", email: "", phone: "", hotel: "", room: "", checkIn: "", checkOut: "" });
                  }}
                  style={{ padding: "10px", background: "gray", color: "white", border: "none", marginTop: "5px" }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Then Admin Bookings List */}
          <div style={{ marginTop: "40px" }}>
            <h4>📋 Existing Admin Bookings</h4>
            {adminBookings.length === 0 ? (
              <p>No manual bookings yet.</p>
            ) : (
              <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "10px" }}>
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
                          onClick={() => handleEdit(b)}
                          style={{ marginRight: "5px", background: "orange", color: "white", border: "none", padding: "5px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          style={{ background: "red", color: "white", border: "none", padding: "5px" }}
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
    </div>
  );
}
