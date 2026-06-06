import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000/api/phong-chieu";

const getAuthHeader = () => {

    const token =
        localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

/**
 * Danh sách tất cả phòng chiếu
 */
const getAllPhongChieu = async () => {

    const response =
        await axios.get(
            API_URL,
            getAuthHeader()
        );

    return response.data;
};

/**
 * Danh sách phòng chiếu thuộc admin hiện tại
 */
const getMyRooms = async () => {

    const response =
        await axios.get(
            `${API_URL}/my-rooms`,
            getAuthHeader()
        );

    return response.data;
};

export default {
    getAllPhongChieu,
    getMyRooms,
};
