import axiosClient from "./axiosClient";

const theLoaiApi = {

    getAllGenres: async () => {

        return await axiosClient.get(
            "/the-loai"
        );
    },
};

export default theLoaiApi;
