import axios from "axios";

const API_URL =
  "http://127.0.0.1:8000/api/booking-history";

const getAuthHeader = () => {

  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getHistory = async () => {

  const response =
    await axios.get(
      API_URL,
      getAuthHeader()
    );

  return response.data;
};

export default {
  getHistory,
};
