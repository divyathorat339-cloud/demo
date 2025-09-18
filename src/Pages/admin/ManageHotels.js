// src/Pages/admin/ManageHotels.jsx
import React, { useState, useEffect } from "react";
import { ref, push, onValue, remove, update } from "firebase/database";
import { db, storage } from "../../firebase";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  FaMapMarkerAlt,
  FaBed,
  FaRupeeSign,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaClipboardList,
  FaHotel,
  FaTimes,
} from "react-icons/fa";

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
  const [viewHotel, setViewHotel] = useState(null);

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, image: file });
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
        .then(() => alert("Hotel deleted successfully!"))
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
        .hotel-form { 
          background: #fff; padding: 25px; border-radius: 12px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.15); 
          width: 100%; max-width: 1000px; 
          margin-bottom: 30px; 
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px; 
        }
        .hotel-form h1 { grid-column: span 2; text-align: center; margin-bottom: 15px; color: #333; font-size: 22px; }
        .form-group { display:flex; flex-direction:column; gap:8px; margin-bottom: 8px; }
        .form-group label { font-size:14px; font-weight:600; color:#444; }
        .hotel-form input, .hotel-form select, .hotel-form textarea {
          width: 100%; padding: 10px 12px; 
          border: 1px solid #ccc; border-radius: 8px; 
          font-size: 14px; outline: none; 
          transition: border 0.2s, box-shadow 0.2s;
        }
        .hotel-form input:focus, .hotel-form textarea:focus, .hotel-form select:focus {
          border-color: #4facfe; box-shadow: 0 0 0 2px rgba(79,172,254,0.2);
        }
        .hotel-form textarea { resize: none; height: 80px; }
        .hotel-form button { 
          grid-column: span 2; padding: 12px; margin-top: 10px;
          background: linear-gradient(135deg, #4facfe, #00cfff); 
          color: #fff; font-weight: bold; 
          border: none; border-radius: 8px; cursor: pointer; 
          transition: 0.3s; font-size: 15px;
        }
        .hotel-form button:hover { background: linear-gradient("#42a5f5;"); }

        .hotel-list { width: 100%; max-width: 1100px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .hotel-card { background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.1); transition: 0.3s; }
        .hotel-card:hover { transform: translateY(-3px); }
        .hotel-card img { width: 100%; height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 10px; }
        .hotel-info h3 { margin: 0; font-size: 18px; color: #333; }
        .hotel-info p { margin: 4px 0; color: #555; font-size: 14px; }
        .hotel-actions { margin-top: 10px; display: flex; justify-content: space-between; }
        .hotel-actions button { flex: 1; margin: 0 5px; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; color: #fff; }
        .view-btn { background: #42a5f5; }
        .edit-btn { background: #29b6f6; }
        .delete-btn { background: #ef5350; }

        /* Modal Styling */
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:1000; animation: fadeIn 0.3s ease; }
        .modal-box { background:#fff; padding:25px; border-radius:16px; max-width:650px; width:90%; box-shadow:0 5px 18px rgba(0,0,0,0.25); text-align:left; animation: scaleUp 0.3s ease; }
        .modal-box img { width:100%; height:220px; object-fit:cover; border-radius:12px; margin-bottom:15px; }
        .modal-box h2 { margin-bottom:15px; color:#222; font-size:24px; display:flex; align-items:center; gap:10px; }
        .modal-details { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .modal-details p { margin:5px 0; color:#444; font-size:15px; display:flex; align-items:center; gap:8px; }
        .modal-desc { grid-column:span 2; margin-top:10px; background:#f9f9f9; padding:10px; border-radius:8px; }
        .close-btn { margin-top:18px; padding:10px 20px; background:#ef5350; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold; float:right; }
        @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
        @keyframes scaleUp { from {transform:scale(0.9);} to {transform:scale(1);} }
      `}</style>

      {/* Hotel Form */}
      <form className="hotel-form" onSubmit={handleSubmit}>
        <h1>{editId ? "Update Hotel" : "Create Hotel"}</h1>
        {/* Form Fields Same as before */}
        <div className="form-group">
          <label>Hotel Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
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
        </div>
        <div className="form-group">
          <label>Room Type</label>
          <select name="roomType" value={form.roomType} onChange={handleChange}>
            <option value="AC Room">AC Room</option>
            <option value="Non AC Room">Non AC Room</option>
          </select>
        </div>
        <div className="form-group">
          <label>Beds</label>
          <select name="beds" value={form.beds} onChange={handleChange}>
            <option value="1 Bed">1 Bed</option>
            <option value="2 Beds">2 Beds</option>
            <option value="3 Beds">3 Beds</option>
          </select>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Amenities</label>
          <input type="text" name="amenities" value={form.amenities} onChange={handleChange} placeholder="Comma separated" />
        </div>
        <div className="form-group">
          <label>Rating (1-5)</label>
          <input type="text" name="rating" value={form.rating} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Contact Phone</label>
          <input type="text" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Contact Email</label>
          <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Upload Image</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editId ? "Update Hotel" : "+ Create Hotel"}
        </button>
      </form>

      {/* Hotel List */}
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
              <button className="view-btn" onClick={() => setViewHotel(hotel)}>View Details</button>
              <button className="edit-btn" onClick={() => handleEdit(hotel)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(hotel.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {viewHotel && (
        <div className="modal-overlay">
          <div className="modal-box">
            {viewHotel.image && <img src={viewHotel.image} alt={viewHotel.name} />}
            <h2><FaHotel /> {viewHotel.name}</h2>
            <div className="modal-details">
              <p><FaMapMarkerAlt /> {viewHotel.location}</p>
              <p><FaBed /> {viewHotel.roomType} - {viewHotel.beds}</p>
              <p><FaRupeeSign /> {viewHotel.price}</p>
              <p><FaStar /> {viewHotel.rating}</p>
              <p><FaPhone /> {viewHotel.contactPhone}</p>
              <p><FaEnvelope /> {viewHotel.contactEmail}</p>
              <div className="modal-desc">
                <p><FaClipboardList /> {viewHotel.description}</p>
                <p>✨ Amenities: {viewHotel.amenities}</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setViewHotel(null)}>
              <FaTimes /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
