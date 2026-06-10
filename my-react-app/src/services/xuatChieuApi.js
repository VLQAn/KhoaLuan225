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

/**
 * Tất cả xuất chiếu
 */
const getAll = async () => {

    const response =
        await axios.get(
            API_URL,
            getAuthHeader()
        );

    return response.data;
};

/**
 * Xuất chiếu theo tài khoản admin
 */
const getMyShowtimes =
    async () => {

        const response =
            await axios.get(
                `${API_URL}/my-showtimes`,
                getAuthHeader()
            );

        return response.data;
    };

/**
 * Chi tiết xuất chiếu
 */
const getById = async (id) => {

    const response =
        await axios.get(
            `${API_URL}/${id}`,
            getAuthHeader()
        );

    return response.data;
};

/**
 * Tạo xuất chiếu
 */
const create = async (data) => {

    const response =
        await axios.post(
            API_URL,
            data,
            getAuthHeader()
        );

    return response.data;
};

/**
 * Cập nhật xuất chiếu
 */
const update = async (
    id,
    data
) => {

    const response =
        await axios.put(
            `${API_URL}/${id}`,
            data,
            getAuthHeader()
        );

    return response.data;
};

/**
 * Xóa xuất chiếu
 */
const remove = async (id) => {

    const response =
        await axios.delete(
            `${API_URL}/${id}`,
            getAuthHeader()
        );

    return response.data;
};

/**
 * Danh sách xuất chiếu đang mở bán
 */
const getAvailable =
    async () => {

        const response =
            await axios.get(
                `${API_URL}/available`
            );

        console.log(
            "AVAILABLE SHOWTIMES",
            response
        );

        return response.data;
    };

export default {
    getAll,
    getMyShowtimes,
    getById,
    create,
    update,
    delete: remove,
    getAvailable,
};
