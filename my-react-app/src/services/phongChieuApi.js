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
 * Lấy danh sách phòng chiếu
 */
const getAllPhongChieu = async () => {

    const response = await axios.get(
        API_URL,
        getAuthHeader()
    );

    return response.data;
};

const phongChieuApi = {
    getAllPhongChieu,
};

export default phongChieuApi;
