// src/Pages/admin/ManageRooms.jsx
import React, { useState, useEffect } from "react";
import { database, storage } from "../../firebase";
import {
  ref as dbRef,
  push,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]); 
  const [form, setForm] = useState({
    roomName: "",
    price: "",
    type: "AC",
    beds: "Single",
    description: "",
    amenities: "",
    availability: "Available",
    images: [],
    rating: "",
    location: "",
    hotelId: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOption, setSortOption] = useState("");

  // ✅ For View Details Modal
  const [viewRoom, setViewRoom] = useState(null);

  useEffect(() => {
    const hotelRef = dbRef(database, "hotels");
    onValue(hotelRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHotels(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      }
    });
  }, []);

  useEffect(() => {
    const roomRef = dbRef(database, "rooms");
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRooms(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      } else {
        setRooms([]);
      }
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const uploadImages = async (roomId) => {
    const urls = [];
    for (const file of images) {
      const imgRef = storageRef(storage, `rooms/${roomId}/${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(editingId ? "Updating..." : "Creating...");
    const roomId = editingId || push(dbRef(database, "rooms")).key;

    let uploadedUrls = [];
    if (images.length > 0) uploadedUrls = await uploadImages(roomId);

    const finalImages =
      editingId && form.images ? [...(form.images || []), ...uploadedUrls] : uploadedUrls;

    const roomData = {
      ...form,
      price: form.price ? Number(form.price) : form.price,
      rating: form.rating ? Number(form.rating) : form.rating,
      images: finalImages,
    };

    if (editingId) {
      await update(dbRef(database, `rooms/${roomId}`), roomData);
      alert("Room updated successfully!");
    } else {
      await set(dbRef(database, `rooms/${roomId}`), roomData);
      alert("Room created successfully!");
    }

    setForm({
      roomName: "",
      price: "",
      type: "AC",
      beds: "Single",
      description: "",
      amenities: "",
      availability: "Available",
      images: [],
      rating: "",
      location: "",
      hotelId: "",
    });
    setImages([]);
    setImagePreviews([]);
    setEditingId(null);
    setLoading("");
  };

  const handleEdit = (room) => {
    setForm({
      roomName: room.roomName || "",
      price: room.price || "",
      type: room.type || "AC",
      beds: room.beds || "Single",
      description: room.description || "",
      amenities: room.amenities || "",
      availability: room.availability || "Available",
      images: room.images || [],
      rating: room.rating ?? "",
      location: room.location || "",
      hotelId: room.hotelId || "",
    });
    setImagePreviews(room.images || []);
    setEditingId(room.id);
    setImages([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await remove(dbRef(database, `rooms/${id}`));
      alert("Room deleted successfully!");
    }
  };

  const filteredRooms = rooms
    .filter((room) => {
      const matchesSearch =
        search.trim() === "" ||
        (room.roomName && room.roomName.toLowerCase().includes(search.toLowerCase())) ||
        (room.location && room.location.toLowerCase().includes(search.toLowerCase()));
      const matchesType = filterType === "All" || (room.type && room.type === filterType);
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortOption === "priceLow") return (a.price || 0) - (b.price || 0);
      if (sortOption === "priceHigh") return (b.price || 0) - (a.price || 0);
      if (sortOption === "ratingHigh") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🏨 Manage Rooms</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="roomName" placeholder="Room Name" value={form.roomName} onChange={handleChange} required style={styles.input} />
        <input type="number" name="price" placeholder="Price per Night (₹)" value={form.price} onChange={handleChange} required style={styles.input} />

        <select name="hotelId" value={form.hotelId} onChange={handleChange} required style={styles.input}>
          <option value="">Select Hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>{hotel.name} ({hotel.city})</option>
          ))}
        </select>

        <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
          <option>AC</option>
          <option>Non-AC</option>
          <option>Deluxe</option>
          <option>Suite</option>
          <option>Dormitory</option>
        </select>

        <select name="beds" value={form.beds} onChange={handleChange} style={styles.input}>
          <option>Single</option>
          <option>Double</option>
          <option>Queen</option>
          <option>King</option>
          <option>Bunk</option>
        </select>

        <input type="text" name="location" placeholder="Location (optional)" value={form.location} onChange={handleChange} style={styles.input} />
        <textarea name="description" placeholder="Room Description" value={form.description} onChange={handleChange} style={styles.textarea} />
        <input type="text" name="amenities" placeholder="Amenities (comma separated)" value={form.amenities} onChange={handleChange} style={styles.input} />

        <select name="availability" value={form.availability} onChange={handleChange} style={styles.input}>
          <option>Available</option>
          <option>Not Available</option>
          <option>Under Maintenance</option>
        </select>

        <input type="number" name="rating" placeholder="Rating (0 - 5)" value={form.rating} onChange={handleChange} min="0" max="5" step="0.1" style={styles.input} />
        <input type="file" multiple accept="image/*" onChange={handleImageChange} style={styles.fileInput} />

        <div style={styles.previewContainer}>
          {form.images && form.images.map((src, idx) => (<img key={`old-${idx}`} src={src} alt="preview" style={styles.preview} />))}
          {imagePreviews.map((src, idx) => (<img key={`new-${idx}`} src={src} alt="preview" style={styles.preview} />))}
        </div>

        <button type="submit" style={styles.button}>{loading || (editingId ? "Update Room ✏️" : "Create Room ➕")}</button>
      </form>

      {/* Controls */}
      <div style={styles.adminControls}>
        <input type="text" placeholder="Search by room name or location..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.controlInput} />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={styles.controlSelect}>
          <option value="All">All Types</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
          <option value="AC">AC</option>
          <option value="Non-AC">Non-AC</option>
          <option value="Deluxe">Deluxe</option>
        </select>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={styles.controlSelect}>
          <option value="">Sort By</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
          <option value="ratingHigh">Ratings: High → Low</option>
        </select>
      </div>

      {/* Rooms */}
      <h3 style={styles.subHeading}>📋 Existing Rooms</h3>
      <div style={styles.roomList}>
        {filteredRooms.map((room) => (
          <div key={room.id} style={styles.roomCard}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>{room.roomName}</h4>
              <div style={{ textAlign: "right" }}>
                <div><b>💰</b> ₹{room.price}</div>
                <div style={{ fontSize: "13px", color: "#555" }}>⭐ {room.rating ?? "N/A"}</div>
              </div>
            </div>

            <p><b>🏨 Hotel:</b> {hotels.find((h) => h.id === room.hotelId)?.name || "N/A"}</p>
            <p><b>🏷️ Type:</b> {room.type} • <b>🛏️ Beds:</b> {room.beds}</p>
            {room.location && <p><b>📍 Location:</b> {room.location}</p>}
            <p><b>📝</b> {room.description}</p>
            <p><b>✨ Amenities:</b> {room.amenities}</p>
            <p><b>📌 Status:</b> {room.availability}</p>

            <div style={styles.cardImgContainer}>
              {room.images && room.images.map((img, idx) => (<img key={idx} src={img} alt="room" style={styles.cardImg} />))}
            </div>

            <div style={{ marginTop: "8px" }}>
              <button onClick={() => setViewRoom(room)} style={styles.viewBtn}>👁 View Details</button>
              <button onClick={() => handleEdit(room)} style={styles.editBtn}>✏️ Edit</button>
              <button onClick={() => handleDelete(room.id)} style={styles.deleteBtn}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for View Details */}
      {viewRoom && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>🏠 {viewRoom.roomName}</h2>
            <p><b>Price:</b> ₹{viewRoom.price}</p>
            <p><b>Hotel:</b> {hotels.find((h) => h.id === viewRoom.hotelId)?.name || "N/A"}</p>
            <p><b>Type:</b> {viewRoom.type} | <b>Beds:</b> {viewRoom.beds}</p>
            {viewRoom.location && <p><b>📍 Location:</b> {viewRoom.location}</p>}
            <p><b>Description:</b> {viewRoom.description}</p>
            <p><b>Amenities:</b> {viewRoom.amenities}</p>
            <p><b>Rating:</b> ⭐ {viewRoom.rating}</p>
            <p><b>Status:</b> {viewRoom.availability}</p>
            <div style={styles.modalImgContainer}>
              {viewRoom.images && viewRoom.images.map((img, idx) => (
                <img key={idx} src={img} alt="room" style={styles.modalImg} />
              ))}
            </div>
            <button onClick={() => setViewRoom(null)} style={styles.closeBtn}>❌ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "18px", minHeight: "100vh", background: "#f5f6fa" },
  heading: { fontSize: "26px", marginBottom: "15px", textAlign: "center" },
  subHeading: { marginTop: "30px", fontSize: "20px" },
  form: { display: "grid", gap: "10px", maxWidth: "700px", margin: "0 auto", padding: "18px", border: "1px solid #ddd", borderRadius: "10px", background: "#fff" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  fileInput: { padding: "6px", border: "1px solid #ccc", borderRadius: "6px" },
  textarea: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  button: { padding: "12px", background: "#3498db", color: "white", fontWeight: "bold", border: "none", borderRadius: "6px", cursor: "pointer" },
  previewContainer: { display: "flex", gap: "8px", flexWrap: "wrap" },
  preview: { width: "65px", height: "65px", objectFit: "cover" },
  adminControls: { maxWidth: "900px", margin: "20px auto", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" },
  controlInput: { padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc" },
  controlSelect: { padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc" },
  roomList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px", marginTop: "15px" },
  roomCard: { border: "1px solid #ddd", borderRadius: "10px", padding: "12px", background: "white" },
  cardImgContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: "6px", marginTop: "8px" },
  cardImg: { width: "100%", height: "90px", objectFit: "cover", borderRadius: "5px" },
  viewBtn: { background: "#42a5f5", color: "white", padding: "6px 10px", borderRadius: "5px", marginRight: "5px" },
  editBtn: { background: "#2980b9", color: "white", padding: "6px 10px", borderRadius: "5px", marginRight: "5px" },
  deleteBtn: { background: "#e74c3c", color: "white", padding: "6px 10px", borderRadius: "5px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { background: "#fff", padding: "20px", borderRadius: "10px", width: "90%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto", textAlign: "center" },
  modalImgContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px", marginTop: "10px" },
  modalImg: { width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" },
  closeBtn: { marginTop: "15px", padding: "10px 18px", background: "#e74c3c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
};
