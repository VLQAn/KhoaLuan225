import axiosClient from "./axiosClient";

const movieApi = {

    getAllMovies: async () => {

        return await axiosClient.get(
            "/movies"
        );
    },

    createMovie: async (data) => {

        return await axiosClient.post(
            "/movies",
            data
        );
    },

    updateMovie: async (id, data) => {

        return await axiosClient.put(
            `/movies/${id}`,
            data
        );
    },

    deleteMovie: async (id) => {

        return await axiosClient.delete(
            `/movies/${id}`
        );
    },

    changeStatus: async (
        id,
        trangThai
    ) => {

        return await axiosClient.patch(
            `/movies/${id}/status`,
            { trangThai }
        );
    },
};

export default movieApi;
