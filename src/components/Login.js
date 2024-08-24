import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://mentors-booking-backend-3.onrender.com/api/students/login",
        { studentId, password }
      );

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-form-container">
      <div className="container">
        <h2 className="header">Login</h2>
        <form onSubmit={handleLogin} className="form">
          <div className="inputGroup">
            <label className="label">Student ID:</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="input"
            />
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
          <button type="submit" className="button">
            Login
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="text">
          New User?
          <Link to="/signup" className="link">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
