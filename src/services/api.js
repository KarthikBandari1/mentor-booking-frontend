import axios from "axios";

const api = {
  fetchMentors: (areaOfInterest) => {
    return axios
      .get(`http://localhost:3000/api/mentors`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching mentors:", error);
        throw error;
      });
  },

  createBooking: (bookingData) => {
    return axios
      .post("http://localhost:3000/api/bookings", bookingData)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error creating booking:", error);
        throw error;
      });
  },
};

export default api;
