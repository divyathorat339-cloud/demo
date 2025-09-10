// src/components/UserLayout.js
import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
export default function UserLayout() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "20px" }}>
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
}
