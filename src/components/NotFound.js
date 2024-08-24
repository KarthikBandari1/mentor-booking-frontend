import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => (
  <div className="not-found-container">
    <h2>404 - Page Not Found</h2>
    <p>Sorry, the page you are looking for does not exist.</p>
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe1U-fzbIq8W3EKClK4jZSXEkaeWKcX4aGIQ&s"
      alt="Not Found"
    />
    <Link to="/">Go back to Home</Link>
  </div>
);

export default NotFound;
