import axios from "axios";

const api = {
  fetchMentors: (areaOfInterest) => {
    return axios
      .get(`https://mentors-booking-backend-3.onrender.com/api/mentors`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching mentors:", error);
        throw error;
      });
  },

  createBooking: (bookingData) => {
    return axios
      .post(
        "https://mentors-booking-backend-3.onrender.com/api/bookings",
        bookingData
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error creating booking:", error);
        throw error;
      });
  },
};

export default api;
