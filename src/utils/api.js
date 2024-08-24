import axios from "axios";

const API_URL = "http://localhost:3000";

export const getMentors = () => axios.get(`${API_URL}/api/mentors`);
export const getBookings = () => axios.get(`${API_URL}/api/bookings`);
export const getMentorCost = (mentorId) =>
  axios.get(`${API_URL}/api/mentors/${mentorId}/cost`);
