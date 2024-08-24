import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BookNewSession.css";
import Sidebar from "./Sidebar";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { jwtDecode } from "jwt-decode";

function BookNewSession() {
  const [mentors, setMentors] = useState([]);
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [cost, setCost] = useState(null);
  const [duration, setDuration] = useState(30);
  const [selectedDay, setSelectedDay] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [studentId, setStudentId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setStudentId(decodedToken.userId);
    } else {
      console.error("No token found");
    }
  }, [token]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/mentors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setMentors(response.data))
      .catch((error) => console.error("Error fetching mentors:", error));
  }, [token]);

  const handleAreaChange = (event) => {
    setAreaOfInterest(event.target.value);
  };

  const handleSelectMentor = (mentor) => {
    setSelectedMentor(mentor);
    setSelectedDay("");
    setAvailableTimeSlots([]);

    if (mentor) {
      const costRates = {
        30: 2000,
        45: 3000,
        60: 4000,
      };

      const baseCost = costRates[duration] || 0;
      const premiumSurcharge = mentor.is_premium ? 500 : 0;
      const totalCost = baseCost + premiumSurcharge;

      setCost(Math.floor(totalCost));
    }
  };

  const handleDurationChange = (event) => {
    const newDuration = event.target.value;
    setDuration(newDuration);
    if (selectedMentor) {
      setCost((prevCost) => Math.floor((prevCost / duration) * newDuration));
      if (selectedDay) {
        calculateAvailableTimeSlots(selectedDay, selectedMentor, newDuration);
      }
    }
  };

  const handleDayChange = (event) => {
    const selectedDay = event.target.value;
    setSelectedDay(selectedDay);

    if (selectedMentor) {
      calculateAvailableTimeSlots(selectedDay, selectedMentor, duration);
    }
  };

  const calculateAvailableTimeSlots = (day, mentor, slotDuration) => {
    const availability = JSON.parse(mentor.availability).find(
      (slot) => slot.day === day
    );

    if (availability) {
      const fromTime = new Date(availability.fromTime);
      const toTime = new Date(availability.toTime);
      const timeSlots = [];

      while (fromTime.getTime() + slotDuration * 60000 <= toTime.getTime()) {
        const endTime = new Date(fromTime.getTime() + slotDuration * 60000);
        timeSlots.push({
          fromTime: new Date(fromTime),
          toTime: endTime,
        });
        fromTime.setTime(endTime.getTime());
      }

      setAvailableTimeSlots(timeSlots);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  const formatAvailability = (availability) => {
    return JSON.parse(availability)
      .map(
        (slot) =>
          `${slot.day}: ${new Date(slot.fromTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${new Date(slot.toTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`
      )
      .join(", ");
  };

  const handlePaymentConfirmation = (startTime, endTime) => {
    const totalCost = Math.floor(cost);
    const confirmPayment = window.confirm(
      `Confirm payment of Rs: ${totalCost}`
    );

    if (confirmPayment) {
      const token = localStorage.getItem("token");

      axios
        .post(
          "http://localhost:3000/api/bookings",
          {
            student_id: studentId,
            mentor_id: selectedMentor.id,
            mentor_name: selectedMentor.name,
            start_time: startTime,
            end_time: endTime,
            area_of_interest: areaOfInterest,
            cost: totalCost,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          alert("Booking created successfully!");
        })
        .catch((error) => {
          console.error("Error creating booking:", error);
          alert("Failed to create booking. Please try again.");
        });
    }
  };

  return (
    <div className="book-new-session">
      <Sidebar />
      <h2>Book New Session</h2>
      <div>
        <label htmlFor="area-of-interest">Select Area of Interest:</label>
        <select
          id="area-of-interest"
          value={areaOfInterest}
          onChange={handleAreaChange}
        >
          <option value="">--Select--</option>
          <option value="Sales">Sales</option>
          <option value="Equity">Equity</option>
          <option value="Marketing">Marketing</option>
          <option value="E-Commerce">E-Commerce</option>
        </select>
      </div>
      <div className="mentor-list">
        {mentors
          .filter(
            (mentor) =>
              !areaOfInterest ||
              mentor.areas_of_expertise
                .toLowerCase()
                .includes(areaOfInterest.toLowerCase())
          )
          .map((mentor) => (
            <div key={mentor.id} className="mentor-item">
              <h3>{mentor.name}</h3>
              <p>
                <strong>Areas of Expertise:</strong> {mentor.areas_of_expertise}
              </p>
              <p>
                <strong>Availability:</strong>
                {formatAvailability(mentor.availability)}
              </p>
              <p>
                <strong>Premium:</strong> {mentor.is_premium ? "Yes" : "No"}
              </p>
              <Popup
                modal
                trigger={
                  <button type="button" className="btn btn-primary mybtn">
                    Select
                  </button>
                }
                onOpen={() => handleSelectMentor(mentor)}
                contentStyle={{ width: "400px", padding: "0px" }}
              >
                {(close) => (
                  <div className="p-3 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Booking Details</h5>
                      <IoIosCloseCircleOutline
                        onClick={() => close()}
                        className="text-danger"
                        size={24}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="mentor-name" className="fw-bold">
                          Mentor:
                        </label>
                        <p className="mb-0">{selectedMentor?.name || "N/A"}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="-name" className="fw-bold">
                          Topic:
                        </label>
                        <p className="mb-0">{areaOfInterest || "N/A"}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="duration" className="fw-bold">
                          Duration:
                        </label>
                        <select
                          className="form-select w-auto"
                          value={duration}
                          onChange={handleDurationChange}
                        >
                          <option value="30">30 minutes</option>
                          <option value="45">45 minutes</option>
                          <option value="60">60 minutes</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="day" className="fw-bold">
                          Day:
                        </label>
                        <select
                          className="form-select w-auto"
                          value={selectedDay}
                          onChange={handleDayChange}
                        >
                          <option value="">--Select--</option>
                          {selectedMentor &&
                            JSON.parse(selectedMentor.availability).map(
                              (slot, index) => (
                                <option key={index} value={slot.day}>
                                  {slot.day}
                                </option>
                              )
                            )}
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="time" className="fw-bold">
                          Time Slot:
                        </label>
                        <select
                          className="form-select w-auto"
                          onChange={(e) => {
                            const selectedSlot = availableTimeSlots.find(
                              (slot) => slot.fromTime === e.target.value
                            );
                            if (selectedSlot) {
                              handlePaymentConfirmation(
                                selectedSlot.fromTime.toISOString(),
                                selectedSlot.toTime.toISOString()
                              );
                            }
                          }}
                        >
                          <option value="">--Select--</option>
                          {availableTimeSlots.map((slot, index) => (
                            <option
                              key={index}
                              value={slot.fromTime.toISOString()}
                            >
                              {`${slot.fromTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })} - ${slot.toTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Cost:</span>
                      <span>{`Rs. ${cost}`}</span>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          if (cost && selectedMentor && selectedDay) {
                            handlePaymentConfirmation(
                              availableTimeSlots[0]?.fromTime.toISOString(),
                              availableTimeSlots[0]?.toTime.toISOString()
                            );
                            close();
                          } else {
                            alert("Please complete all fields.");
                          }
                        }}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          ))}
      </div>
    </div>
  );
}

export default BookNewSession;
