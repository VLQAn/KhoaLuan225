import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000/api/auth";

const authApi = {

    // LOGIN
    login: async (data) => {

        return await axios.post(
            `${API_URL}/login`,
            data
        );
    },

    // REGISTER
    register: async (data) => {

        return await axios.post(
            `${API_URL}/register`,
            data
        );
    },

    // GET CURRENT USER
    me: async () => {

        const token =
            localStorage.getItem("token");

        return await axios.get(
            `${API_URL}/me`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    Accept:
                        "application/json",
                },
            }
        );
    },

    // LOGOUT
    logout: async () => {

        const token =
            localStorage.getItem("token");

        return await axios.post(
            `${API_URL}/logout`,
            {},
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    Accept:
                        "application/json",
                },
            }
        );
    },

    // CHANGE PASSWORD
    changePassword: async (data) => {

        const token =
            localStorage.getItem("token");

        return await axios.post(
            `${API_URL}/change-password`,
            data,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    Accept:
                        "application/json",
                },
            }
        );
    },

    // SEND OTP
    sendOtp: async (email) => {

        return await axios.post(
            `${API_URL}/send-otp`,
            { email }
        );
    },

    // RESET PASSWORD
    resetPassword: async (data) => {

        return await axios.post(
            `${API_URL}/reset-password`,
            data
        );
    },
};

export default authApi;
