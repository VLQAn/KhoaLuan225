import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getHistory = async () => {
  const response = await axios.get(
    `${BASE_URL}/booking-history`,
    getAuthHeader()
  );
  return response.data;
};

const cancelTicket = async (maHoaDon) => {
  const response = await axios.put(
    `${BASE_URL}/booking/${maHoaDon}/cancel`,
    {},
    getAuthHeader()
  );
  return response.data;
};

export default {
  getHistory,
  cancelTicket,
};
