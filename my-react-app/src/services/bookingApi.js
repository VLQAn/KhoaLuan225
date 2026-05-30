import axiosClient from "./axiosClient";

const bookingApi = {

    getAllBookings: async () => {

        return await axiosClient.get(
            "/admin/bookings"
        );
    },

    getBookingById: async (id) => {

        return await axiosClient.get(
            `/admin/bookings/${id}`
        );
    },

};

export default bookingApi;
