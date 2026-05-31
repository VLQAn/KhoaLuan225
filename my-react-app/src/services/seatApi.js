import axiosClient from "./axiosClient";

const seatApi = {

    getSeatMap: (maXuatChieu) =>
        axiosClient.get(
            `/xuat-chieu/${maXuatChieu}/seats`
        )

};

export default seatApi;
