import React from "react";
import "../styles/Home.css";
import Sidebar from "./Sidebar";

function Home() {
  return (
    <div className="home">
      <Sidebar />
      <h1>Welcome to CareerCarve</h1>
      <p>Your gateway to booking 1x1 sessions with mentors.</p>
      <img
        src="https://www.envisionexperience.com/~/media/images/envisionemi/blog/bigstock-teacher-giving-personal-instru-3917765.jpg?h=600&la=en&w=900"
        alt="Mentoring"
      />
    </div>
  );
}

export default Home;
