// src/Pages/admin/Dashboard.js
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
export default function Dashboard() {
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    bookings: 0,
    staff: 0,
  });
  const [bookingData, setBookingData] = useState([]);
  const [roomCategories, setRoomCategories] = useState({});
  const [topMonth, setTopMonth] = useState(null);
  useEffect(() => {
    const hotelsRef = ref(db, "hotels");
    const roomsRef = ref(db, "rooms");
    const bookingsRef = ref(db, "bookings");
    const staffRef = ref(db, "staff");
    onValue(hotelsRef, (snapshot) => {
      setStats((prev) => ({
        ...prev,
        hotels: snapshot.exists() ? Object.keys(snapshot.val()).length : 0,
      }));
    });
    onValue(roomsRef, (snapshot) => {
      if (snapshot.exists()) {
        const rooms = snapshot.val();
        setStats((prev) => ({ ...prev, rooms: Object.keys(rooms).length }));

        const categories = {};
        Object.values(rooms).forEach((room) => {
          categories[room.type] = (categories[room.type] || 0) + 1;
        });
        setRoomCategories(categories);
      }
    });
    onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const bookings = snapshot.val();
        setStats((prev) => ({
          ...prev,
          bookings: Object.keys(bookings).length,
        }));
        const monthly = {};
        Object.values(bookings).forEach((b) => {
          const date = new Date(b.date || Date.now());
          const month = date.toLocaleString("default", { month: "short" });
          monthly[month] = (monthly[month] || 0) + 1;
        });
        const formatted = Object.keys(monthly).map((m) => ({
          month: m,
          count: monthly[m],
        }));
        setBookingData(formatted);
        if (formatted.length > 0) {
          const best = formatted.reduce((max, item) =>
            item.count > max.count ? item : max
          );
          setTopMonth(best);
        }
      }
    });
    onValue(staffRef, (snapshot) => {
      setStats((prev) => ({
        ...prev,
        staff: snapshot.exists() ? Object.keys(snapshot.val()).length : 0,
      }));
    });
  }, []);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "40px",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Admin Dashboard
      </h2>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {[
          { title: "Hotels", value: stats.hotels, color: "#007bff" },
          { title: "Rooms", value: stats.rooms, color: "#28a745" },
          { title: "Bookings", value: stats.bookings, color: "#ffc107" },
          { title: "Staff", value: stats.staff, color: "#17a2b8" },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: card.color,
              color: "white",
              padding: "25px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3>{card.title}</h3>
            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              {card.value}
            </p>
          </div>
        ))}

        {/* ✅ AI-Powered Insights Card */}
        <div
          style={{
            background: "#ff5722",
            color: "white",
            padding: "25px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
            animation: "pulse 2s infinite",
          }}
        >
          <h3>🤖 AI-Powered Insights</h3>
          {topMonth ? (
            <p style={{ fontSize: "18px", marginTop: "10px" }}>
              Month with the highest bookings:{" "}
              <b>{topMonth.month}</b> ({topMonth.count} bookings)
            </p>
          ) : (
            <p>📊 No data available</p>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
        }}
      >
        {/* ✅ Bookings Over Time (Bar Chart) */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>📊 Bookings Over Time</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={bookingData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✅ Room Categories (Pie Chart) */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>🏨 Room Categories</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={Object.keys(roomCategories).map((cat, i) => ({
                    name: cat,
                    value: roomCategories[cat],
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {Object.keys(roomCategories).map((cat, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🔥 CSS for animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 5px #ff5722; }
            50% { transform: scale(1.05); box-shadow: 0 0 25px #ff784e; }
            100% { transform: scale(1); box-shadow: 0 0 5px #ff5722; }
          }
        `}
      </style>
    </div>
  );
}
