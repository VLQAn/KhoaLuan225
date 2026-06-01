import axiosClient from "./axiosClient";

const giaVeApi = {

    getCurrent: () =>
        axiosClient.get(
            "/gia-ve-hien-tai"
        ),

    getByXuatChieu: (
        maXuatChieu
    ) =>
        axiosClient.get(
            `/gia-ve/xuat-chieu/${maXuatChieu}`
        )
};

export default giaVeApi;
