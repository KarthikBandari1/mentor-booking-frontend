import axios from "axios";

const API_URL = "https://mentors-booking-backend-3.onrender.com/";

export const getMentors = () => axios.get(`${API_URL}/api/mentors`);
export const getBookings = () => axios.get(`${API_URL}/api/bookings`);
export const getMentorCost = (mentorId) =>
  axios.get(`${API_URL}/api/mentors/${mentorId}/cost`);
