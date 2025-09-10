// src/Pages/admin/ManageHotels.jsx
import React, { useState, useEffect } from "react";
import { ref, push, onValue, remove, update } from "firebase/database";
import { db, storage } from "../../firebase";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "Sangli",
    roomType: "AC Room",
    beds: "1 Bed",
    price: "",
    description: "",
    amenities: "",
    rating: "",
    contactPhone: "",
    contactEmail: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hotelRef = ref(db, "hotels");
    onValue(hotelRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const hotelArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setHotels(hotelArray);
      } else {
        setHotels([]);
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("Please fill in the required fields: Name and Price");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = "";
      if (form.image instanceof File) {
        const storageRef = sRef(storage, `hotels/${Date.now()}_${form.image.name}`);
        await uploadBytes(storageRef, form.image);
        imageUrl = await getDownloadURL(storageRef);
      } else if (typeof form.image === "string") {
        imageUrl = form.image;
      }

      const dataToSave = { ...form, image: imageUrl };
      if (editId) {
        await update(ref(db, `hotels/${editId}`), dataToSave);
        alert("Hotel updated successfully!");
      } else {
        await push(ref(db, "hotels"), dataToSave);
        alert("Hotel created successfully!");
      }

      resetForm();
    } catch (err) {
      alert("Error saving hotel: " + err.message);
    }
    setLoading(false);
  };

  const handleEdit = (hotel) => {
    setForm({ ...hotel, image: hotel.image || null });
    setEditId(hotel.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this hotel?");
    if (confirmDelete) {
      remove(ref(db, `hotels/${id}`))
        .then(() => {
          alert("Hotel deleted successfully!");
        })
        .catch((err) => alert("Error deleting hotel: " + err.message));
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      location: "Sangli",
      roomType: "AC Room",
      beds: "1 Bed",
      price: "",
      description: "",
      amenities: "",
      rating: "",
      contactPhone: "",
      contactEmail: "",
      image: null,
    });
    setEditId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <style>{`
        .hotel-form { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); width: 100%; max-width: 1000px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .hotel-form h1 { grid-column: span 2; text-align: center; margin-bottom: 10px; color: #333; font-size: 22px; }
        .hotel-form input, .hotel-form select, .hotel-form textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; outline: none; transition: border 0.2s; }
        .hotel-form input:focus, .hotel-form textarea:focus, .hotel-form select:focus { border-color: #4facfe; }
        .hotel-form textarea { resize: none; height: 80px; }
        .hotel-form button { grid-column: span 2; padding: 12px; background: linear-gradient(135deg, #4facfe, #00f2fe); color: #fff; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .hotel-form button:hover { background: linear-gradient(135deg, #00f2fe, #4facfe); }
        .hotel-list { width: 100%; max-width: 1100px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .hotel-card { background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.1); transition: 0.3s; }
        .hotel-card:hover { transform: translateY(-3px); }
        .hotel-card img { width: 100%; height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 10px; }
        .hotel-info h3 { margin: 0; font-size: 18px; color: #333; }
        .hotel-info p { margin: 4px 0; color: #555; font-size: 14px; }
        .hotel-actions { margin-top: 10px; display: flex; justify-content: space-between; }
        .hotel-actions button { flex: 1; margin: 0 5px; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; color: #fff; }
        .edit-btn { background: #ff9800; }
        .delete-btn { background: #f44336; }
      `}</style>

      <form className="hotel-form" onSubmit={handleSubmit}>
        <h1>{editId ? "Update Hotel" : "Create Hotel"}</h1>
        <input type="text" name="name" placeholder="Hotel Name" value={form.name} onChange={handleChange} required />
        <select name="location" value={form.location} onChange={handleChange}>
          <option value="Sangli">Sangli</option>
          <option value="Satara">Satara</option>
          <option value="Kolhapur">Kolhapur</option>
          <option value="Pune">Pune</option>
          <option value="Bengluru">Bengluru</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Nashik">Nashik</option>
          <option value="Karad">Karad</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Solapur">Solapur</option>
        </select>
        <select name="roomType" value={form.roomType} onChange={handleChange}>
          <option value="AC Room">AC Room</option>
          <option value="Non AC Room">Non AC Room</option>
        </select>
        <select name="beds" value={form.beds} onChange={handleChange}>
          <option value="1 Bed">1 Bed</option>
          <option value="2 Beds">2 Beds</option>
          <option value="3 Beds">3 Beds</option>
        </select>
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <textarea name="description" placeholder="Hotel Description" value={form.description} onChange={handleChange} />
        <input type="text" name="amenities" placeholder="Amenities (comma separated)" value={form.amenities} onChange={handleChange} />
        <input type="text" name="rating" placeholder="Rating (1-5)" value={form.rating} onChange={handleChange} />
        <input type="text" name="contactPhone" placeholder="Contact Phone" value={form.contactPhone} onChange={handleChange} />
        <input type="email" name="contactEmail" placeholder="Contact Email" value={form.contactEmail} onChange={handleChange} />
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editId ? "Update Hotel" : "+ Create Hotel"}
        </button>
      </form>

      <div className="hotel-list">
        {hotels.map((hotel) => (
          <div className="hotel-card" key={hotel.id}>
            {hotel.image && <img src={hotel.image} alt={hotel.name} />}
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <p>📍 {hotel.location}</p>
              <p>{hotel.roomType} • {hotel.beds}</p>
              <p>💲 {hotel.price}</p>
              <p>⭐ {hotel.rating}</p>
              <p>{hotel.description}</p>
            </div>
            <div className="hotel-actions">
              <button className="edit-btn" onClick={() => handleEdit(hotel)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(hotel.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
