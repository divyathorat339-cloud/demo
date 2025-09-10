import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import AdminLogin from "./Pages/admin/AdminLogin";
import Dashboard from "./Pages/admin/Dashboard";
import ManageHotels from "./Pages/admin/ManageHotels";
import ManageRooms from "./Pages/admin/ManageRooms";
import RoomCategories from "./Pages/admin/RoomCategories";
import Bookings from "./Pages/admin/Bookings";
import Users from "./Pages/admin/Users";
import AddStaff from "./Pages/admin/staff/AddStaff";

// User Pages
import Home from "./Pages/user/Home";
import HotelsList from "./Pages/user/HotelsList";
import AboutUs from "./Pages/user/AboutUs";
import ContactUs from "./Pages/user/ContactUs";
import HotelDetails from "./Pages/user/HotelDetails";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import Rooms from "./Pages/user/Rooms";
import RoomDetails from "./Pages/user/RoomDetails";
import BookingForm from "./Pages/user/BookingForm";
import BookingSuccess from "./Pages/user/BookingSuccess";
import MyBookings from "./Pages/user/MyBookings";
import Profile from "./Pages/user/Profile";
import Sidebar from "./components/Sidebar";
import UserProtectedRoute from "./components/UserProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* ===================== USER PANEL ===================== */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hotels" element={<HotelsList />} />
        <Route path="/hotels/:city" element={<HotelsList />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/forgotpassword" element={<ForgotPassword />} />

        {/* ✅ Corrected Rooms Route */}
        <Route path="/rooms/:hotelId" element={<Rooms />} />
        <Route path="/room/:id" element={<RoomDetails />} />

        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/book/:id"
          element={
            <UserProtectedRoute>
              <BookingForm />
            </UserProtectedRoute>
          }
        />
        <Route path="/booking-success/:bookingId" element={<BookingSuccess />} />

        {/* ===================== ADMIN PANEL ===================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <div style={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <main
                  style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}
                >
                  <Routes>
                    <Route path="" element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="hotels" element={<ManageHotels />} />
                    <Route path="rooms" element={<ManageRooms />} />
                    <Route path="categories" element={<RoomCategories />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="users" element={<Users />} />
                    <Route path="staff/new" element={<AddStaff />} />

                    {/* 404 inside admin panel */}
                    <Route path="*" element={<h2>404 - Admin Page Not Found</h2>} />
                  </Routes>
                </main>
              </div>
            </AdminProtectedRoute>
          }
        />

        {/* ===================== GLOBAL 404 ===================== */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
