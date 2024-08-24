import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../styles/auth.css";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [availability, setAvailability] = useState([]);
  const [areaOfInterest, setAreaOfInterest] = useState([]);
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/students/register",
        {
          name,
          email,
          availability: availability.join(","),
          area_of_interest: areaOfInterest.join(","),
          password,
        }
      );

      const { student_id } = response.data;

      alert(`Student created successfully! Your student ID is: ${student_id}`);

      navigate("/login");
    } catch (error) {
      setError("Error signing up. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setAvailability((prev) =>
      checked ? [...prev, value] : prev.filter((day) => day !== value)
    );
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setAreaOfInterest((prev) =>
      checked ? [...prev, value] : prev.filter((interest) => interest !== value)
    );
  };

  return (
    <div className="auth-form-container mt-4">
      <div className="container">
        <h2 className="header">Signup</h2>
        <form onSubmit={handleSignup} className="form">
          <div className="inputGroup">
            <label className="label">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label">Availability:</label>
            <div className="checkbox-group">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    value={day}
                    onChange={handleDayChange}
                    className="m-2"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <div className="inputGroup">
            <label className="label">Area of Interest:</label>
            <div className="checkbox-group">
              {["Sales", "Equity", "Marketing", "E-Commerce"].map(
                (interest) => (
                  <label key={interest}>
                    <input
                      type="checkbox"
                      value={interest}
                      onChange={handleInterestChange}
                      className="m-2"
                    />
                    {interest}
                  </label>
                )
              )}
            </div>
          </div>
          <div className="inputGroup">
            <label className="label">Password:</label>
            <div className="passwordContainer">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
              <span className="icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </div>
          <div className="inputGroup">
            <label className="label">Confirm Password:</label>
            <div className="passwordContainer">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
              />
              <span className="icon" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="button">
            Signup
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="text">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
