import axiosClient from "./axiosClient";

const paymentApi = {

    createVNPay: (maHoaDon) =>
        axiosClient.post(
            `/payments/vnpay/${maHoaDon}`
        ),

    createMoMo: (maHoaDon) =>
        axiosClient.post(
            `/payments/momo/${maHoaDon}`
        )
};

export default paymentApi;
