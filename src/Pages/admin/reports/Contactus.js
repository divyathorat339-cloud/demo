import React, { useEffect, useState } from "react";
import { db } from "../../../firebase"; // Make sure this is correct
import { ref, onValue } from "firebase/database";

export default function ContactUsReport() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(db, "contacts"); // ⚠️ Fetch from "contacts" node
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messageArray);
      } else {
        setMessages([]);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        ✉️ Contact Us Messages
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "20px", textAlign: "center" }}>
        Total Messages: <b>{messages.length}</b>
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, index) => (
            <tr
              key={msg.id}
              style={{
                textAlign: "center",
                backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
              }}
            >
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{msg.name || "N/A"}</td>
              <td style={tdStyle}>{msg.email || "N/A"}</td>
              <td style={tdStyle}>{msg.message || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  fontWeight: "bold",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};
