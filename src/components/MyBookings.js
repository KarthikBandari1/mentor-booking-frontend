import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MyBookings.css";
import Sidebar from "./Sidebar";
import { jwtDecode } from "jwt-decode";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    } else {
      console.error("No token found");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(
          `https://mentors-booking-backend-3.onrender.com/api/bookings/student/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => setBookings(response.data))
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  }, [userId]);

  return (
    <div className="my-bookings">
      <Sidebar />
      <div className="content">
        <h2>My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="no-bookings">You have no bookings yet.</p>
        ) : (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id}>
                <p>Mentor: {booking.mentor_name}</p>
                <p>
                  Start Time: {new Date(booking.start_time).toLocaleString()}
                </p>
                <p>End Time: {new Date(booking.end_time).toLocaleString()}</p>
                <h3>Cost: {booking.cost} INR</h3>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
