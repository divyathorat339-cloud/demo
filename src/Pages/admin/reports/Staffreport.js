import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { ref, onValue } from "firebase/database";

export default function StaffReport() {
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const staffRef = ref(db, "staff");
    onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setStaffList(arr);
      } else {
        setStaffList([]);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        👥 Staff Report
      </h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Hotel ID</th>
          </tr>
        </thead>
        <tbody>
          {staffList.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No staff found.
              </td>
            </tr>
          ) : (
            staffList.map((staff, idx) => (
              <tr
                key={staff.id}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#fafafa" : "white",
                  textAlign: "center",
                }}
              >
                <td style={tdStyle}>{idx + 1}</td>
                <td style={tdStyle}>{staff.fullName || "N/A"}</td>
                <td style={tdStyle}>{staff.email || "N/A"}</td>
                <td style={tdStyle}>{staff.phone || "N/A"}</td>
                <td style={tdStyle}>{staff.role || "N/A"}</td>
                <td style={tdStyle}>{staff.hotelId || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};
