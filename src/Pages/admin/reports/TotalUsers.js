import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";

export default function TotalUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        👥 Registered Users
      </h1>

      {users.length === 0 ? (
        <p style={{ color: "gray", textAlign: "center" }}>No users found.</p>
      ) : (
        <div style={{ overflowX: "auto", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>ID</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Full Name</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Email</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Mobile</th>
               
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? "#f9f9f9" : "#ffffff")
                  }
                >
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{i + 1}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{u.name || "N/A"}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{u.email || "N/A"}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{u.phone || "N/A"}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
