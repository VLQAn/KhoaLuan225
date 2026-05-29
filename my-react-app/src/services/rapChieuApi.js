import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/rap-chieu";

const getAuthHeader = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Lấy danh sách rạp
const getAllRapChieu = async () => {

    const response = await axios.get(
        API_URL,
        getAuthHeader()
    );

    return response.data;
};

// Lấy chi tiết rạp
const getRapChieuById = async (id) => {

    const response = await axios.get(
        `${API_URL}/${id}`,
        getAuthHeader()
    );

    return response.data;
};

// Thêm rạp
const createRapChieu = async (data) => {

    const response = await axios.post(
        API_URL,
        data,
        getAuthHeader()
    );

    return response.data;
};

// Cập nhật rạp
const updateRapChieu = async (id, data) => {

    const response = await axios.put(
        `${API_URL}/${id}`,
        data,
        getAuthHeader()
    );

    return response.data;
};

// Xóa rạp
const deleteRapChieu = async (id) => {

    const response = await axios.delete(
        `${API_URL}/${id}`,
        getAuthHeader()
    );

    return response.data;
};

const rapChieuApi = {
    getAllRapChieu,
    getRapChieuById,
    createRapChieu,
    updateRapChieu,
    deleteRapChieu,
};

export default rapChieuApi;
