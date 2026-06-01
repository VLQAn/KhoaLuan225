import axiosClient from "./axiosClient";

const datVeApi = {

    create: (data) =>
        axiosClient.post(
            "/dat-ve",
            data
        )
};

export default datVeApi;
