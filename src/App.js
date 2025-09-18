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

// Reports
import TotalBookings from "./Pages/admin/reports/TotalBookings";
import TotalUsers from "./Pages/admin/reports/TotalUsers";
import TotalHotels from "./Pages/admin/reports/TotalHotels";
import Reviews from "./Pages/admin/reports/Reviews";
import Contactus from "./Pages/admin/reports/Contactus";
import Staffreport from "./Pages/admin/reports/Staffreport";
import TopHotels from "./Pages/admin/reports/TopHotels";
import AllBookings from "./Pages/admin/reports/AllBookings";


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

// Components
import UserProtectedRoute from "./components/UserProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout"; // ✅ Use AdminLayout

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

        {/* ✅ Corrected Rooms Routes */}
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
        <Route
          path="/booking-success/:bookingId"
          element={<BookingSuccess />}
        />

        {/* ===================== ADMIN PANEL ===================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout /> {/* ✅ Sidebar + Margin fix */}
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hotels" element={<ManageHotels />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="categories" element={<RoomCategories />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="users" element={<Users />} />
          <Route path="staff/new" element={<AddStaff />} />

          {/* ✅ Reports inside Admin Layout */}
          <Route path="reports/total-bookings" element={<TotalBookings />} />
          <Route path="reports/total-users" element={<TotalUsers />} />
          <Route path="reports/total-hotels" element={<TotalHotels />} />
          <Route path="reports/Reviews" element={<Reviews />} />
          <Route path="reports/Contactus" element={<Contactus />} />
          <Route path="reports/Staffreport" element={<Staffreport />} />
          <Route path="reports/top-hotels" element={<TopHotels />} />
          <Route path="reports/all-bookings" element={<AllBookings />} />
       

          {/* 404 inside admin */}
          <Route path="*" element={<h2>404 - Admin Page Not Found</h2>} />
        </Route>

        {/* ===================== GLOBAL 404 ===================== */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
