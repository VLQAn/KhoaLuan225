import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000/api/admin/dashboard";

const getDashboard = async () => {

    const token =
        localStorage.getItem("token");

    const response =
        await axios.get(
            API_URL,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    return response.data;
};

export default {
    getDashboard
};
