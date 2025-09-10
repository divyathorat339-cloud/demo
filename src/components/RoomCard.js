// src/Pages/user/Rooms.jsx
import React, { useState, useEffect } from "react";
import { database } from "../../firebase"; 
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const roomsRef = ref(database, "rooms");
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRooms(roomArray);
      } else {
        setRooms([]);
      }
    });
  }, []);
  const handleBook = (room) => {
   navigate(`/booking/${room.id}`);
  };
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "40px 20px",
    minHeight: "80vh",
    background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
  };
  const RoomCard = ({ room }) => {
    const cardStyle = {
      position: "relative",
      width: "300px",
      borderRadius: "15px",
      overflow: "hidden",
      margin: "15px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      cursor: "pointer",
      transition: "transform 0.3s, box-shadow 0.3s",
      background: "#fff",
    };
    const imageStyle = {
      width: "100%",
      height: "190px",
      objectFit: "cover",
      display: "block",
    };
    const overlayStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(0deg, rgba(0,0,0,0.4), transparent)",
    };
    const badgeStyle = {
      position: "absolute",
      top: "12px",
      left: "12px",
      background: "#ff7b54",
      color: "#fff",
      padding: "5px 12px",
      borderRadius: "10px",
      fontSize: "12px",
      fontWeight: "600",
    };
    const ratingStyle = {
      position: "absolute",
      top: "12px",
      right: "12px",
      color: "#ffd700",
      fontSize: "14px",
      fontWeight: "600",
    };
    const contentStyle = {
      padding: "16px 18px",
    };
    const titleStyle = {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "6px",
      color: "#333",
    };
    const subtitleStyle = {
      fontSize: "14px",
      marginBottom: "10px",
      color: "#666",
    };
    const priceStyle = {
      fontSize: "16px",
      fontWeight: "600",
      color: "#222",
      marginBottom: "12px",
    };
    const buttonStyle = {
      width: "100%",
      padding: "10px",
      border: "none",
      borderRadius: "10px",
      background: "linear-gradient(90deg, #ff7b54, #ffb347)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s",
    };
    return (
      <div
        style={cardStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-6px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0px)")
        }
      >
        <img
          style={imageStyle}
          src={room.imageUrl || "https://via.placeholder.com/300x190"}
          alt={room.roomName}
        />
        <div style={overlayStyle}></div>
        <div style={badgeStyle}>{room.roomType}</div>
        <div style={ratingStyle}>
          {"★".repeat(room.rating || 4)}
          {"☆".repeat(5 - (room.rating || 4))}
        </div>
        <div style={contentStyle}>
          <h3 style={titleStyle}>{room.roomName}</h3>
          <p style={subtitleStyle}>
            {room.hotel} • {room.beds}
          </p>
          <p style={priceStyle}>₹{room.price} / night</p>
          <button style={buttonStyle} onClick={() => handleBook(room)}>
            Book Now
          </button>
        </div>
      </div>
    );
  };
  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        {rooms.length > 0 ? (
          rooms.map((room) => <RoomCard key={room.id} room={room} />)
        ) : (
          <p style={{ fontSize: "18px", color: "#555" }}>No rooms available.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
