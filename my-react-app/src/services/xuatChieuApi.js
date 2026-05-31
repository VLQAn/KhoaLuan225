import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000/api/xuat-chieu";

const getAuthHeader = () => {

    const token =
        localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const xuatChieuApi = {

    getAll: async () => {

        const response = await axios.get(
            API_URL,
            getAuthHeader()
        );

        return response.data;
    },

    getById: async (id) => {

        const response = await axios.get(
            `${API_URL}/${id}`,
            getAuthHeader()
        );

        return response.data;
    },

    create: async (data) => {

        const response = await axios.post(
            API_URL,
            data,
            getAuthHeader()
        );

        return response.data;
    },

    update: async (id, data) => {

        const response = await axios.put(
            `${API_URL}/${id}`,
            data,
            getAuthHeader()
        );

        return response.data;
    },

    delete: async (id) => {

        const response = await axios.delete(
            `${API_URL}/${id}`,
            getAuthHeader()
        );

        return response.data;
    },

    getAvailable: async () => {

        const response = await axios.get(
            `${API_URL}/available`
        );

        return response.data;
    },
};

export default xuatChieuApi;
