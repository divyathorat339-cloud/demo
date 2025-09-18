import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";

export default function TopHotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const bookingsRef = ref(database, "bookings");
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      const counts = {};
      if (data) {
        Object.values(data).forEach((b) => {
          if (b.hotelName) {
            counts[b.hotelName] = (counts[b.hotelName] || 0) + 1;
          }
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        setHotels(sorted);
      }
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Top Hotels by Bookings</h1>
      <p className="text-lg mb-4">Total Hotels: <b>{hotels.length}</b></p>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Rank</th>
            <th className="border border-gray-300 px-4 py-2">Hotel Name</th>
            <th className="border border-gray-300 px-4 py-2">Bookings</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(([hotel, count], i) => (
            <tr key={i} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{i + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{hotel}</td>
              <td className="border border-gray-300 px-4 py-2">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
